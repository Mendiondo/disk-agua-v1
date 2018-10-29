import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../models/order';
import { AngularFireDatabase } from 'angularfire2/database';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';
import { OrderStatus } from '../../models/order-status';

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  order = {} as Order;
  dtDelivery: Date;
  isEditDtDelivery: boolean = false;

  constructor(public navCtrl: NavController,
    private afDatabase: AngularFireDatabase,
    private basketService: BasketServiceProvider,
    public navParams: NavParams) {
    this.order = navParams.get("orderSelected");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
  }

  setDeliveryDate() {
    this.isEditDtDelivery = true;
  }

  saveDeliveryDate() {    
    this.basketService.updateOrderField(this.order, "dtDelivery", this.dtDelivery);
    this.isEditDtDelivery = false;
  }

  cancelDeliveryDate() {
    this.isEditDtDelivery = false;
  }

  acceptOrder() {
    this.order.status = OrderStatus.ACEITO;
    this.basketService.updateOrderField(this.order, "status", OrderStatus.ACEITO);
  }
  
  finishOrder() {
    this.basketService.updateOrderField(this.order, "status", OrderStatus.FINALIZADO);
    this.navCtrl.setRoot('OrderListPage');
  }
  
  cancelOrder() {
    this.basketService.updateOrderField(this.order, "status", OrderStatus.CANCELADO);
    this.navCtrl.setRoot('OrderListPage');
  }

}
