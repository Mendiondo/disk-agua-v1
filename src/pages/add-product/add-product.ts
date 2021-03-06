import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Product } from '../../models/product';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {  
  products$: Observable<Product[]>
  products: Product[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,
    public basketService: BasketServiceProvider) {
  }

  ionViewDidLoad() {
    let productLs = this.basketService.getProducts();    
    
    // if (productLs.length == 0) {    
        this.products$ = this.afDatabase
        .list<Product>(`product`, products => products.orderByChild('order'))        
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
    // } else {
    //   this.products = productLs;
    // }
  }

  increment(product: Product) {    
    this.basketService.addProduct(product);    
  }

  decrement(product: Product) {    
    this.basketService.removeProduct(product);
  }

  getSubTotal(product: Product) {
    return product.amount == 0 ? 0 : product.price * product.amount;
  }

  comprar() {    
    this.navCtrl.push("BasketPage");
  }

}
