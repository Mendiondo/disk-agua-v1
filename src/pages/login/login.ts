import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AddProductPage } from '../add-product/add-product';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(
    private auth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuController : MenuController ,
    private platform: Platform,
    public events: Events,
    private googlePlus: GooglePlus) {
    firebase.auth().languageCode = 'pt';
  }

  ionViewDidLoad() {
    // this.menuController.swipeEnable(false);
    console.log('ionViewDidLoad LoginPage');
  }
  
  ionViewWillLeave() {
    // this.menuController.swipeEnable(true);
   }

  async login(user: User) {
    this.auth.auth.signInWithEmailAndPassword(user.email, user.password).then(auth => {
      this.navCtrl.setRoot('ProfilePage');
    }).catch((e) => console.error(e));
  }

  loginWithGoogle() {
    if (this.platform.is('cordova')) {
      this.googlePlus.login({
        'offline': true,
        "webClientId": '766581663061-5j4469fmth9kn5uuj75kbeevkprqpov9.apps.googleusercontent.com'
      }).then(res => {
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(success => {
            this.navCtrl.setRoot('ProfilePage');
            this.events.publish('user:created', this.user, Date.now());
            console.log("Firebase success: " + JSON.stringify(success));
          }).catch(error =>
            console.log("Firebase failure: " + JSON.stringify(error))
          );
      }).catch(err => console.error("Error: ", err));

    } else {
      this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(auth => {
        this.navCtrl.setRoot('ProfilePage');
        this.events.publish('user:created', this.user, Date.now());
      }).catch((e) => console.error(e));
    }

    
  }

  loginWithFacebook() {
    // try {
    //   //const result = this.auth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider);
    //   const result = this.auth.auth.signInAndRetrieveDataWithCredential(new firebase.auth.GoogleAuthProvider);

    //   console.log(result);
    //   if (result) {
    //     this.navCtrl.setRoot(AddProductPage);
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
  }

  register() {
    this.navCtrl.push('RegisterPage')
  }

}
