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
  products: Product[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth,
    public basketService: BasketServiceProvider) {
  }

  ionViewDidLoad() {
    let productLs = this.basketService.getProducts();
    console.log(productLs);
    console.log(productLs.length);
    if (productLs.length == 0) {
      this.auth.authState.take(1).subscribe(auth => {
        this.products$ = this.afDatabase.list(`produtoCliente/${auth.uid}`, {
          query: {
            orderByChild: 'order'
          }
        }
        );
        console.log("1.5");
        console.log(this.products$);
        this.products$.forEach(product => {
          this.products = product;
          this.basketService.setProducts(product);    
          console.log("2");      
          console.log(this.products);      
        });
        this.products$.take(1).subscribe(x => console.log(x))
      });
    } else {
      this.products = productLs;
      console.log("3" + this.products);
    }
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
    this.basketService.addProduct(product);    
  }

  decrement(product: Product) {    
    this.basketService.removeProduct(product);

  }

  getSubTotal(product: Product) {
    return product.quantidade == 0 ? 0 : product.price * product.quantidade;
  }

  comprar() {    
    this.navCtrl.setRoot("BasketPage");
  }

}
