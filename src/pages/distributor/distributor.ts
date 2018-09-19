import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FIREBASE_CONFIG } from '../../app/app.firebase.config';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { Profile } from '../../models/profile';
import { Roles } from '../../models/roles';

@IonicPage()
@Component({
  selector: 'page-distributor',
  templateUrl: 'distributor.html',
})
export class DistributorPage {
  profile = {} as Profile;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private http: HttpClient,
    private alertService: AlertServiceProvider) {
  }

  ionViewDidLoad() { }

  save() {
    let secondaryApp = firebase.initializeApp(FIREBASE_CONFIG, "Secondary");

    let pass = this.generateRandomToken(6);
    this.profile.pass = pass;
    this.profile.role = Roles.DISTRIBUTOR;
    secondaryApp.auth().createUserWithEmailAndPassword(this.profile.email, pass).then(
      user => {
        this.profile.distributorId = user.uid;
        this.afDatabase.object(`profile/${user.uid}`).set(this.profile);
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
    let params = '?e=' + this.profile.email + '&n=' + this.profile.fullName + '&p=' + pass;
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