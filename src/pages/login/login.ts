import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(private auth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams) {
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
    this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(auth => {
      this.navCtrl.setRoot(HomePage);
    }).catch((e) => console.error(e));        
  }

  bkp(user: User) {
    try {
      const result = this.auth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(result);
      if (result) {
        this.navCtrl.setRoot(HomePage);
      }
    } catch (e) {
      console.error(e);
    }
    
    
    
    try {
      this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(auth => {
        this.navCtrl.setRoot(HomePage);
      }).catch((e) => console.error(e));

      const result = this.auth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      console.log(result);
      if (result) {
        this.navCtrl.setRoot(HomePage);
      }
    } catch (e) {
      console.error(e);
    }  
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
