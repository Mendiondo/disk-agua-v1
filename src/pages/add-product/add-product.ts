import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';
import { Observable } from 'rxjs/Observable';

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
    
    if (productLs.length == 0) {    
        this.products$ = this.afDatabase
        .list<Product>(`produto`, products => products.orderByChild('order'))        
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
