import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Order } from '../../models/order';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';


@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {  
  orders: Observable<Order[]> ;

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
    this.navCtrl.push('OrderDetailPage', { orderSelected: order });
  }

}
