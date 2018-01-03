import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Profile } from '../../models/profile';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profileData: FirebaseObjectObservable<Profile>

  constructor(
    private auth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private toast: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewWillLoad() {
    this.auth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.toast.create({
          message: `Bem vindo!`,
          duration: 3000
        }).present();

        this.profileData = this.afDatabase.object(`profile/${data.uid}`)
      } else {
        this.toast.create({
          message: `Uruário não encontrado!`,
          duration: 3000
        }).present();
      }      
    })
  }

  logout() {    
    this.auth.auth.signOut().then(auth => {
       this.navCtrl.setRoot('LoginPage');
      //this.navCtrl.setRoot(ListPage);
    }).catch((e) => console.error(e));        
  }

}
