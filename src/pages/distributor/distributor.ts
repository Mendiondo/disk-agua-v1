import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FIREBASE_CONFIG } from '../../app/app.firebase.config';
import { Distributor } from '../../models/distributor';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';


@IonicPage()
@Component({
  selector: 'page-distributor',
  templateUrl: 'distributor.html',
})
export class DistributorPage {
  distributor = {} as Distributor;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth,
    private http: HttpClient,
    private alertService: AlertServiceProvider) {
  }

  ionViewDidLoad() { }

  save() {
    let secondaryApp = firebase.initializeApp(FIREBASE_CONFIG, "Secondary");

    let pass = this.generateRandomToken(6);
    this.distributor.pass = pass;
    secondaryApp.auth().createUserWithEmailAndPassword(this.distributor.email, pass).then(
      user => {
        this.distributor.id = user.uid;
        this.afDatabase.object(`distributor/${this.distributor.id}`).set(this.distributor);
        this.navCtrl.setRoot("DistributorPage");
        this.sendEmail(pass);
        secondaryApp.delete();
      }).catch(err => {
        this.alertService.showAlert("Aviso", err);
        console.error('Error', err);
        secondaryApp.delete();
      });
  }

  generateRandomToken(size: number): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < size; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  sendEmail(pass: String) {
    let params = '?e=' + this.distributor.email + '&n=' + this.distributor.fullName + '&p=' + pass;
    return this.http.get('https://us-central1-disk-agua-santa-catarina.cloudfunctions.net/sendemail/' + params)
      .subscribe(
        res => {
          console.log(res.toString);
          this.alertService.showAlert("Aviso", "Distribuidor salvo com sucesso!")
        },
        msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
      );
  }

}
