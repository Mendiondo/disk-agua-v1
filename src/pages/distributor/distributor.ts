import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Product } from '../../models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Distributor } from '../../models/distributor';


@IonicPage()
@Component({
  selector: 'page-distributor',
  templateUrl: 'distributor.html',
})
export class DistributorPage {
  distributor = {} as Distributor;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,  
    private auth: AngularFireAuth) {
  }

  ionViewDidLoad() { }

  save() {    
    this.afDatabase.object(`distributor/${this.distributor.name}`).set(this.distributor)
    .then(() => {
      //this.auth.auth.createUserWithEmailAndPassword(this.distributor.email, this.generateRandomPass());
      this.navCtrl.setRoot("DistributorPage")
    });
  }

  generateRandomPass(): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

}
