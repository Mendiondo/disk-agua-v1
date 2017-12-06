import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { HomePage } from '../home/home';
//import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GooglePlus } from '@ionic-native/google-plus';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(
    private auth: AngularFireAuth,
    //private inAppBrowser: InAppBrowser,
    public navCtrl: NavController,
    public navParams: NavParams,
    private googlePlus: GooglePlus) {
    firebase.auth().languageCode = 'pt';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async login(user: User) {
    this.auth.auth.signInWithEmailAndPassword(user.email, user.password).then(auth => {
      this.navCtrl.setRoot('ProfilePage');
    }).catch((e) => console.error(e));
  }

  loginWithGoogle() {
    this.googlePlus.login({      
      'offline': true,
      "webClientId": '766581663061-5j4469fmth9kn5uuj75kbeevkprqpov9.apps.googleusercontent.com'
    })
      .then(res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(success => {
            this.navCtrl.setRoot('ProfilePage');
            console.log("Firebase success: " + JSON.stringify(success));
          })
          .catch(error => console.log("Firebase failure: " + JSON.stringify(error)));
      }).catch(err => console.error("Error: ", err));
  }

  loginWithFacebook() {
    try {
      //const result = this.auth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider);
      const result = this.auth.auth.signInAndRetrieveDataWithCredential(new firebase.auth.GoogleAuthProvider);

      console.log(result);
      if (result) {
        this.navCtrl.setRoot(HomePage);
      }
    } catch (e) {
      console.error(e);
    }
  }

  register() {
    this.navCtrl.push('RegisterPage')
  }

}
