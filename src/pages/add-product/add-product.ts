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
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';

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
    public basketService: BasketServiceProvider,
    public userAuthService: UserAuthServiceProvider) {
  }

  ionViewDidLoad() {
    let productLs = this.basketService.getProducts();
    let uid = this.userAuthService.getUserID();
    
    if (productLs.length == 0) {    
        this.products$ = this.afDatabase
        .list<Product>(`produtoCliente/${uid}`, products => products.orderByChild('order'))        
        .snapshotChanges()
        .take(1)
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
