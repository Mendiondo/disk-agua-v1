import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TestPage } from '../test/test';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    private auth: AngularFireAuth,
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
      } else {
        this.toast.create({
          message: `Uruário não encontrado!`,
          duration: 3000
        }).present();
      }      
    })
  }

  logout() {
    try {
      const result = this.auth.auth.signOut();
      console.log(result);
    } catch(e) {
      console.error(e);
    }
    
  }

  goToTestPage() {
    this.navCtrl.push(TestPage);
  }


}
