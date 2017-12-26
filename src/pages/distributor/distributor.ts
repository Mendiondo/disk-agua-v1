import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Product } from '../../models/product';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-distributor',
  templateUrl: 'distributor.html',
})
export class DistributorPage {

  product = {} as Product

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DistributorPage');
  }

  save() {
    this.auth.authState.take(1).subscribe(auth => {
      this.afDatabase.object(`produto/${this.product.clientId}`).set(this.product)
      .then(() => this.navCtrl.setRoot(HomePage))
    })
  }

}
