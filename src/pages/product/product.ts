import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  product = {} as Product;  
  products$: Observable<Product[]>
  selectedValue: any;  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private afDatabase: AngularFireDatabase) {
  }

  ionViewDidLoad() {        
    this.products$ = this.afDatabase
    .list<Product>(`produto`)
    .snapshotChanges()      
    .map(
      changes => {
        return changes.map( c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      }
    )    
  }

  save() {    
    this.afDatabase.object(`produto/${this.product.name}`).set(this.product)
    .then(() => this.navCtrl.setRoot("DistributorPage"));
  }

  selectProduct() {
    this.product = this.selectedValue;
    console.log(this.product);
  }

}
