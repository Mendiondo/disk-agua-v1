import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserSatisfaction } from '../../models/user-satisfaction';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';

@IonicPage()
@Component({
  selector: 'page-customer-satisfaction',
  templateUrl: 'customer-satisfaction.html',
})
export class CustomerSatisfactionPage {
  userSatisfaction = {} as UserSatisfaction;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private userAuthService: UserAuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerSatisfactionPage');
  }

  save() {
    let date = new Date();
    this.userSatisfaction.dtCreated = date.toUTCString();
    this.userSatisfaction.id = this.afDatabase.createPushId();
    this.userSatisfaction.userId = this.userAuthService.getUserID();

    this.afDatabase.object(`user-satisfaction/${this.userSatisfaction.id}`).set(this.userSatisfaction)
      .then(() => this.navCtrl.setRoot("AddProductPage"));
  }

}
