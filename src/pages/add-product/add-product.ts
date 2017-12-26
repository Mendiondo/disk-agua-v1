import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../models/product';
import { CartItem } from '../../models/cartItem';
import { Cart } from '../../models/cart';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {
  // cart = {} as Cart;
  // product = {} as Product;
  // product1 = {} as Product;
  // cartItem = {} as CartItem;
  // cartItem1 = {} as CartItem;
  // cartItems = {} as CartItem[];
  currentNumber = 0 as number;
  products$: FirebaseListObservable<Product[]>
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private afDatabase: AngularFireDatabase) {    
    /* this.product.clientId = 1 
    this.product.filePath = "assets/imgs/pet_500ml_sem_gas.png"
    this.product.name = "Pet 500 ml" 
    this.product.price = 0; 

    this.cartItem.product = this.product;
    this.cartItem.qtd = 1;
    this.cartItem.priceSubTotal = 0;
    
    this.product.clientId = 2 
    this.product.filePath = "assets/imgs/pet_500ml_com_gas.png"
    this.product.name = "Pet 500 ml" 
    this.product.price = 0; 
    
    this.cartItem1.product = this.product1;
    this.cartItem1.qtd = 1;
    this.cartItem1.priceSubTotal = 0;
    
    // this.cart.cartItems[0] = this.cartItem;
    // this.cart.cartItems[1] = this.cartItem1;
    this.cartItems[0] = this.cartItem;
    this.cartItems[1] = this.cartItem1; */
  }
  
  ionViewDidLoad() {
    this.products$ = this.afDatabase.list("produto");

    this.products$.subscribe(x => console.log(x));

    console.log('ionViewDidLoad AddProductPage');
  }

  increment(product: Product) {
    this.currentNumber = this.currentNumber +1;
  }

  decrement() {
    if (this.currentNumber == 0) 
      this.currentNumber = 0;  
    else 
      this.currentNumber = this.currentNumber -1;
  }

}
