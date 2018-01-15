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
  total: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public basketService: BasketServiceProvider) {
  }

  ionViewDidLoad() {
    this.products = this.basketService.getProducts();
    this.total = this.basketService.getProducts()
    .map(product => product.subTotal)
    .reduce((total,subTotal) => total + subTotal, 0)
    
    // .subscribe(totalPrice => this.total = totalPrice) 

    console.log('ionViewDidLoad BasketPage');

    // .reduce( (total,price) => total + price, 0)
  }

  goBack() {
    this.navCtrl.setRoot("AddProductPage");
  }

}
