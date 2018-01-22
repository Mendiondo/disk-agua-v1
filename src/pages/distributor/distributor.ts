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
      this.products$ = this.afDatabase.list(`produtoCliente/${auth.uid}`);
      this.products$.take(1).subscribe(x => { 
         this.afDatabase.list(`produto`).take(1).subscribe(y => x.concat(y));
      });
    });    
  }

  save() {
    // if (this.product != null && this.product.price.toString() != '') {
    //   console.log('OK');
    // } else {
    //   console.log('Wrong');
    // }
    // this.product.name = "Pet 10L";
    // this.product.clientId = "wudBdsFUMNcTmKZzFE4PAtx3S4S2";
    // this.product.filePath = "assets/imgs/pet_10l.png";
    // this.product.order = 8;
    // this.product.price = 8.10;
    // this.product.quantidade = 0;
    // this.product.subTotal = 0;
    this.auth.authState.take(1).subscribe(auth => {
      this.product.clientId = auth.uid;
      this.afDatabase.object(`produtoCliente/${auth.uid}/${this.product.name}`).set(this.product)
      .then(() => this.navCtrl.setRoot("DistributorPage"))
    })
  }

  selectProduct() {
    this.product = this.selectedValue;
    console.log(this.product);
  }

}
