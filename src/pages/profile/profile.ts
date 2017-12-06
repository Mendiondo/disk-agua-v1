import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Profile } from '../../models/profile';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile = {} as Profile;
  //profile: FirebaseObjectObservable<Profile>

  constructor(private auth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase,
    private toast: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  bkp() {
    this.auth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.toast.create({
          message: `Bem vindo!`,
          duration: 3000
        }).present();

       // this.profile = this.afDatabase.object(`profile/${data.uid}`)
      } else {
        this.toast.create({
          message: `Uruário não encontrado!`,
          duration: 3000
        }).present();
      }      
    })
  }

  createProfile() {
    this.auth.authState.take(1).subscribe(auth => {
      this.afDatabase.object(`profile/${auth.uid}`).set(this.profile)
      .then(() => this.navCtrl.setRoot(HomePage))
    })
  }

}
