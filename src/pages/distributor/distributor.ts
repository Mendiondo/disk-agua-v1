import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Product } from '../../models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Distributor } from '../../models/distributor';
import { Adress } from '../../models/adress';
import { AdressListServiceProvider } from '../../providers/adress-list-service/adress-list-service';


@IonicPage()
@Component({
  selector: 'page-distributor',
  templateUrl: 'distributor.html',
})
export class DistributorPage {
  distributor = {} as Distributor;
  adress = {} as Adress;
  adressList: Adress[];
  level: string;

  isReadonly() {
    return true;
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afDatabase: AngularFireDatabase,  
    private auth: AngularFireAuth,
    private adressService: AdressListServiceProvider) {
  }

  ionViewDidLoad() {
    this.adressList = new Array();
  }
  
  setAdress(adressData) {
    console.log("adr:" + adressData.terms[0].value);
    this.adress.fullAdress = adressData.terms[0].value;
  }

  save() {    
    this.afDatabase.object(`distribuidor/${this.distributor.name}`).set(this.distributor)
    .then(() => this.navCtrl.setRoot("DistributorPage"));
  }

  addAdress(adress: Adress) {
    this.adressService.add(adress);
    this.adressList.push(adress);
  }

}
