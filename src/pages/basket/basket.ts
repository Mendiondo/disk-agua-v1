import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';
import { Product } from '../../models/product';


@IonicPage()
@Component({
  selector: 'page-basket',
  templateUrl: 'basket.html',
})
export class BasketPage {
  products: Product[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public basketService: BasketServiceProvider) {
  }

  ionViewDidLoad() {
    this.products = this.basketService.getProducts();
    console.log('ionViewDidLoad BasketPage');
  }

}
