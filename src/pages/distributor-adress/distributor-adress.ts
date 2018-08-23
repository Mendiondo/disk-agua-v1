import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Adress } from '../../models/adress';
import { Distributor } from '../../models/distributor';
import { AdressListServiceProvider } from '../../providers/adress-list-service/adress-list-service';
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
  adressListObservable: Observable<Adress[]>;
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
    
    this.loadDistributor();
  }
  
  loadDistributor() {
    this.distributors$ = this.afDatabase
    .list<Distributor>(`distributor`)
    .snapshotChanges()      
    .map(changes => {
      return changes.map( c => ({
        key: c.payload.key, ...c.payload.val()
      }))
    }
  );
}

loadAdressList() {
  this.adressListObservable = this.afDatabase
  .list<Distributor>(`distributor-by-id/${this.distributor.id}`)
  .snapshotChanges()      
  .map(changes => {
    return changes.map( c => ({
      key: c.payload.key, ...c.payload.val()
    }))
  }
);

this.adressListObservable.forEach(adress => {
  this.adressList = adress;
});
this.adressListObservable.take(1).subscribe(x => console.log(x))
}

selectDistributor() {
  this.distributor = this.selectedValue;
  console.log(this.selectedValue)    
  this.loadAdressList();
}

  setAdress(adressData) {    
    this.adress.fullAdress = adressData.terms[0].value + "_" + adressData.terms[1].value + "_" + adressData.terms[2].value;
    this.adress.adressId = adressData.id;
  }

  save(adress: Adress) {
    // let items: AngularFireList<Adress[]>;
    // items = this.afDatabase.list(`distribuidor-adress/${this.distributor.id}`);
    // items.push(this.adressList);
    
    // this.afDatabase.object(`distribuidor-adress/${this.distributor.id}`).set(this.adress)
    // .then(() => this.alertService.showAlert("Aviso", "Distribuidor salvo com sucesso"));    
    //.then(() => this.navCtrl.setRoot("DistributorPage"));

    // firebase.database().ref(`distribuidor-adress`).child(`${this.distributor.id}`).once("value", function(snapshot) {
    //   if (snapshot.exists()) {
    //     console.log(snapshot.val);
    //   } else {
    //     console.log("Username is not in use");
    //   }
    // });
    
    if (!this.validateAdress(adress)) {
      return;
    }

    this.afDatabase.object(`distributor-by-adress/${adress.fullAdress}`).valueChanges().take(1)
      .subscribe(snapshot => {
        if (snapshot != null) {
          console.log(snapshot);                        
          if (snapshot[`distributorId${adress.level}`]) {
            this.alertService.showAlert("Aviso", "Endereço já cadastrado para este nível!");            
          } else {            
            this.adress.distributorId1 = snapshot["distributorId1"] ? snapshot["distributorId1"] : null;
            this.adress.distributorId2 = snapshot["distributorId2"] ? snapshot["distributorId2"] : null;
            this.adress.distributorId3 = snapshot["distributorId3"] ? snapshot["distributorId3"] : null;
            this.saveAdress(adress);
            console.log("adress saved 1");
          }
        } else {
          this.saveAdress(adress);          
          console.log("adress saved 2");
        }
      });      
      
  }

  saveAdress(adress: Adress) {
    this.adress[`distributorId${adress.level}`] = this.distributor.id;
    this.afDatabase.object(`distributor-by-id/${this.distributor.id}/${this.adress.fullAdress}`)
    .set(this.adress);

    this.afDatabase.object(`distributor-by-adress/${this.adress.fullAdress}`)
    .set(this.adress)
    .then(() => this.alertService.showAlert("Aviso", "Distribuidor salvo com sucesso"));
    
    this.adressList.push(this.adress);
    this.adress = this.initAdress();
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
      // adress['distributorId'] = this.distributor.
      this.adressList.push(adress);
      this.adress = this.initAdress();
    } else {
      this.alertService.showAlert("Aviso", "Endereço já cadastrado!");
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
    adress.distributorId1 = "";
    adress.distributorId2 = "";
    adress.distributorId3 = "";
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
    if (index > -1) {
      this.adressList.splice(index, 1);
    }
    
    this.afDatabase.object(`distributor-by-id/${this.distributor.id}/${adress.fullAdress}`).remove();  
    //TODO remover somente o id e se nao ficou sem id remove o registro
    this.adress[`distributorId${adress.level}`] = "";
    console.log("1 " + adress['distributorId1']);
    console.log("2 " + adress['distributorId2']);
    console.log("3 " + adress['distributorId3']);
    if (adress['distributorId1'] == 'undefined' && adress['distributorId2'] == 'undefined' && adress['distributorId3']) {
      console.log("1 " + `distributorId${adress.level} : ""`);
      this.afDatabase.object(`distributor-by-adress/${adress.fullAdress}`).remove();
    } else {
      console.log("2" + `distributor-by-adress/${adress.fullAdress}` +" - "+`distributorId${adress.level} : ""`);
      adress[`distributorId${adress.level}`] = "";
      this.afDatabase.object(`distributor-by-adress/${adress.fullAdress}`).update(adress);
      //this.afDatabase.object(`distributor-by-adress/${adress.fullAdress}`).update(`{distributorId${adress.level} : ""}`);
    }
  }
}