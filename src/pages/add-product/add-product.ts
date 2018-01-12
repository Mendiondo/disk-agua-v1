import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../models/product';
import { CartItem } from '../../models/cartItem';
import { Cart } from '../../models/cart';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { updateDate } from 'ionic-angular/util/datetime-util';
import * as firebase from 'firebase/app';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {
  products$: FirebaseListObservable<Product[]>
  //products: Product[] = new Array();
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth,
    public basketService: BasketServiceProvider) {
  }
  
  ionViewDidLoad() {
    this.auth.authState.take(1).subscribe(auth => {      
      this.products$ = this.afDatabase.list(`produtoCliente/${auth.uid}`
       , {
        query: {
          orderByChild: 'order'
        }
      } 
      );      
      this.products$.take(1).subscribe(x => console.log(x));
    });
    // this.auth.authState.take(1).subscribe(auth => {      
    //   var ref = firebase.database().ref(`produtoCliente/${auth.uid}`).or;
    //   ref.on("value", function(snapshot) {
    //     this.producs = snapshot.val();
    //     console.log(this.producs);
    //   }, function (errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    //   });
    // });

  }

  increment(product: Product) {
    product.quantidade = product.quantidade + 1;
    product.subTotal = this.getSubTotal(product);
    this.basketService.addProduct(product);
    // this.products.push(product);
    // console.log(this.products);
  }
  
  decrement(product: Product) {    
    product.quantidade = product.quantidade == 0 ? 0 : product.quantidade - 1;    
    product.subTotal = this.getSubTotal(product);
    this.basketService.removeProduct(product);
    // const index = this.products.indexOf(product);
    // this.products.splice(index, 1);
    // console.log(this.products);
  }
  
  getSubTotal(product: Product) {
    return product.quantidade == 0 ? 0 : product.price * product.quantidade;
  }

  comprar() {
    this.navCtrl.setRoot("BasketPage");
  }

}
