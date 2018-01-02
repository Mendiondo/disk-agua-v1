import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Product } from '../../models/product';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-distributor',
  templateUrl: 'distributor.html',
})
export class DistributorPage {

  product = {} as Product;
  products$: FirebaseListObservable<Product[]>
  selectedValue: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth) {
  }

  ionViewDidLoad() {    
    this.auth.authState.take(1).subscribe(auth => {      
      this.products$ = this.afDatabase.list(`produto/${auth.uid}`);      
      this.products$.subscribe(x => console.log(x));
    });    
  }

  save() {
    // this.product.filePath="assets/imgs/bombona_20l.png";
    // this.product.name = "Bombona 20L";
    // this.product.quantidade = 0;
    // this.product.subTotal = 0;
    this.auth.authState.take(1).subscribe(auth => {
      this.product.clientId = auth.uid;
      this.afDatabase.object(`produto/${auth.uid}/${this.product.name}`).set(this.product)
      .then(() => this.navCtrl.setRoot("AddProductPage"))
    })
  }

  selectProduct() {
    this.product = this.selectedValue;
    console.log(this.product);
  }

}
