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
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';


@IonicPage()
@Component({
  selector: 'page-distributor-adress',
  templateUrl: 'distributor-adress.html',
})
export class DistributorAdressPage {

  distributor = {} as Distributor;
  distributors$: Observable<Distributor[]>;
  selectedValue: any;
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
    private adressService: AdressListServiceProvider,
    private alertService: AlertServiceProvider) {
  }

  ionViewDidLoad() {
    this.adressList = new Array();
    this.adress = this.initAdress();
    
    this.distributors$ = this.afDatabase
    .list<Distributor>(`distributor`)
    .snapshotChanges()      
    .map(
      changes => {
        return changes.map( c => ({
          key: c.payload.key, ...c.payload.val()
        }))
      }
    )
  }

  selectDistributor() {
    this.distributor = this.selectedValue;
    console.log(this.distributor);
  }
  
  setAdress(adressData) {
    console.log("adr:" + adressData.terms[0].value);
    this.adress.fullAdress = adressData.terms[0].value;
  }

  save() {    
    this.afDatabase.object(`distribuidor-adress/${this.distributor.name}`).set(this.distributor)
    .then(() => this.navCtrl.setRoot("DistributorPage"));
  }

  addAdress(adress: Adress) {
    if (!this.validateAdress(adress)) {
      return;
    }
    // this.adressService.add(adress);
    let res = this.adressList   
    .filter(item => item.fullAdress == adress.fullAdress);
    console.log(res);
    if (res.length == 0) {
      this.adressList.push(adress);
      this.adress = this.initAdress();
    } else {
      this.alertService.showAlert("Aviso", "Endereço já cadastrado!")
      alert("Endereço já cadastrado");
    }
  }

  initAdress(): Adress {
    let adress = {} as Adress;
    adress.fullAdress = "";
    adress.isFullStreet = true;
    adress.nInitial = null;
    adress.nFinal = null;
    adress.level = 1;
    return adress;
  }

  validateAdress(adress: Adress):Boolean{
    console.log("Adress");
    console.log(adress.fullAdress);
    if (adress == undefined || adress.fullAdress == "") {
      this.alertService.showAlert("Aviso", "Favor selecionar o endereço!");
      return false;
    }
    if (adress.isFullStreet == undefined && adress.nInitial == undefined && adress.nFinal == undefined) {
      this.alertService.showAlert("Aviso", "Favor informar o número do endereço ou selecionar como Rua Inteira!");      
      return false;
    }
    return true;
  }

  removeAdress(adress: Adress) {
    const index = this.adressList.indexOf(adress);
    if (index > -1)
      this.adressList.splice(index, 1); 
  }
}