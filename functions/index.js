'use strict';

const functions = require('firebase-functions');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true, });
const admin = require('firebase-admin');

const APP_NAME = 'App Disk Água Santa Catarina';
// const gmailEmail = "slawrows@gmail.com";
// const gmailPassword = "dkpanba73635";
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    // service: 'gmail',
    
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    }
});

admin.initializeApp();

const sendemail = express();
function sendEmail(email, name, pass) {
    const mailOptions = {
        from: `${APP_NAME} <noreply@firebase.com>`,
        to: email,
    };
    
    // The user subscribed to the newsletter.
    mailOptions.subject = `Bem vindo ao ${APP_NAME}!`;
    mailOptions.text = `Olá ${name} seu usuário de acesso ao ${APP_NAME} é: email: ${email} e senha: ${pass}.`;
    return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('New welcome email sent to:', email);
    });
}

sendemail.get('/', (req, res) => {
    cors(req, res, () => {
        sendEmail(req.query.e, req.query.n, req.query.p)
        .then(
            res.status(200)
        ).catch(function (err) {
            res.status(500).send(err);
        })
        
    });
});
exports.sendemail = functions.https.onRequest(sendemail);

const sendpush = express();
function sendPush(token, title, body) {
    const payload = {
        notification: {
            title: title,
            body: body
        }
    }
    return admin.messaging().sendToDevice(token, payload);
}

sendpush.get('/', (req, res) => {
    cors(req, res, () => {
        console.log("sendpush");
        console.log(req.query);
        // console.log(req.query.token);
        sendPush(req.query.token, req.query.title, req.query.body)
            .then(() => {
                return res.status(200);
            }).catch(function (err) {
                return res.status(500).send(err);
            });
    });
});
exports.sendpush = functions.https.onRequest(sendpush);
