import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Order } from '../../models/order';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';


@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {  
  orders: Observable<Order[]> ;
  orderSelected: Order;

  constructor(public navCtrl: NavController, 
    private afDatabase: AngularFireDatabase,
    private userAuthService: UserAuthServiceProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderListPage');
    let userId = this.userAuthService.getUserID();

    this.orders = this.afDatabase.list<Order>(`orders-by-user-id/${userId}`, ref => 
      ref.orderByChild("status")
      .equalTo("Em Aberto")
    ).valueChanges();
  }

  onSelect(order) {
    this.orderSelected = order;
    this.navCtrl.push('OrderDetailPage', { orderSelected: order });
  }

}
