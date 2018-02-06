import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../models/product';
import { Cart } from '../../models/cart';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { updateDate } from 'ionic-angular/util/datetime-util';
import * as firebase from 'firebase/app';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {
  // products$: FirebaseListObservable<Product[]>
  products$: Observable<Product[]>
  products: Product[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth,
    public basketService: BasketServiceProvider) {
  }

  ionViewDidLoad() {
    let productLs = this.basketService.getProducts();    
    if (productLs.length == 0) {
      this.auth.authState.take(1).subscribe(auth => {                
        this.products$ = this.afDatabase
        .list<Product>(`produtoCliente/${auth.uid}`, products => products.orderByChild('order'))
        .snapshotChanges()      
        .map(
          changes => {
            return changes.map( c => ({
              key: c.payload.key, ...c.payload.val()
            }))
          }
        );        
        this.products$.forEach(product => {
          this.products = product;
          this.basketService.setProducts(product);          
        });
        this.products$.take(1).subscribe(x => console.log(x))
      });
    } else {
      this.products = productLs;
    }
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
    this.navCtrl.push("BasketPage");
  }

}
