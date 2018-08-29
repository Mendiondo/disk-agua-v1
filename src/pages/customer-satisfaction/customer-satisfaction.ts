import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserSatisfaction } from '../../models/user-satisfaction';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-customer-satisfaction',
  templateUrl: 'customer-satisfaction.html',
})
export class CustomerSatisfactionPage {  
  userSatisfaction = {} as UserSatisfaction;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerSatisfactionPage');
  }

  save() {
    let date = new Date();
    this.userSatisfaction.dtCreated = date.toUTCString();
    this.afDatabase.object("user-satisfaction").set(this.userSatisfaction);
  }

}
