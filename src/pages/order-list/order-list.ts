import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Order } from '../../models/order';

/**
 * Generated class for the OrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {
  private order: Order;

  constructor(public navCtrl: NavController, 
    private afDatabase: AngularFireDatabase,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderListPage');

    this.afDatabase
      .list("orders")
      .query
      .orderByChild("status")
      .equalTo("Em Aberto")
      .once('value')
      .then(value => {
          console.log(value.val());
        }
      )
  }

}
