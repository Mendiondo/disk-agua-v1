import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Product } from '../../models/product';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Distributor } from '../../models/distributor';
import { Adress } from '../../models/adress';
import { AdressListServiceProvider } from '../../providers/adress-list-service/adress-list-service';
import { empty } from 'rxjs/Observer';


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
    this.adress.fullAdress = "Teste endereço grande!!!!"
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
    // this.adressService.add(adress);
    let res = this.adressList   
    .filter(item => item.fullAdress == adress.fullAdress);
    console.log(res);
    if (res.length == 0) {
      this.adressList.push(adress);
      this.adress = {} as Adress;
      this.adress.fullAdress = "";
      this.adress.isFullStreet = null;
      this.adress.nInitial = null;
      this.adress.nFinal = null;
    } else {
      alert("Endereço já cadastrado");
    } 

  }

}
