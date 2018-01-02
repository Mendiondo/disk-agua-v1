import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../models/product';
import { CartItem } from '../../models/cartItem';
import { Cart } from '../../models/cart';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { updateDate } from 'ionic-angular/util/datetime-util';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {
  products$: FirebaseListObservable<Product[]>
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth) {
  }
  
  ionViewDidLoad() {
    this.auth.authState.take(1).subscribe(auth => {      
      this.products$ = this.afDatabase.list(`produto/${auth.uid}`
      /* , {
        query: {
          orderByChild: 'price',
          equalTo: '10'
        }
      } */
      );      
      this.products$.subscribe(x => console.log(x));
    })

  }

  increment(product: Product) {
    product.quantidade = product.quantidade + 1;
    product.subTotal = product.quantidade == 0 ? 0 : product.price * product.quantidade;
    // this.updateSubTotal(product);
  }
  
  decrement(product: Product) {    
    product.quantidade = product.quantidade == 0 ? 0 : product.quantidade - 1;    
    product.subTotal = product.quantidade == 0 ? 0 : product.price * product.quantidade;
    // this.updateSubTotal(product);
  }
  
  updateSubTotal(product: Product){
  }

}
