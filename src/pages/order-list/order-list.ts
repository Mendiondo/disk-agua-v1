import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Order } from '../../models/order';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {  
  orders: Observable<Order[]> ;

  constructor(public navCtrl: NavController, 
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderListPage');
    let userId = this.auth.auth.currentUser.uid;

    this.orders = this.afDatabase.list<Order>(`orders-by-user-id/${userId}`, ref => 
      ref.orderByChild("status")
      .equalTo("Em Aberto")
    ).valueChanges();
    //https://medium.com/nycdev/create-an-angular2-ionic2-mobile-app-with-a-list-nested-detail-and-form-pattern-c03c9195dfa6    
  }

}
