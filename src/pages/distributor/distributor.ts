import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Product } from '../../models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';
import { Distribuidor } from '../../models/distribuidor';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-distributor',
  templateUrl: 'distributor.html',
})
export class DistributorPage {

  product = {} as Product;
  // products$: FirebaseListObservable<Product[]>
  products$: Observable<Product[]>
  selectedValue: any;
  distribuidor = {} as Distribuidor;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth) {
  }

  ionViewDidLoad() {    
    this.auth.authState.take(1).subscribe(auth => {
      this.products$ = this.afDatabase
      .list<Product>(`produtoCliente/${auth.uid}`)
      .snapshotChanges()      
      .map(
        changes => {
          return changes.map( c => ({
            key: c.payload.key, ...c.payload.val()
          }))
        }
      )

      // this.products$ = this.afDatabase.list(`produtoCliente/${auth.uid}`);
      // this.products$.take(1).subscribe(x => { 
      //    this.afDatabase.list(`produto`).take(1).subscribe(y => x.concat(y));
      // });
    });    
  }

  save() {
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
