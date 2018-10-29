import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

@Component({
  selector: 'adress-search-field',
  templateUrl: 'adress-search-field.html'
})
export class AdressSearchFieldComponent {
  @Output() adressData = new EventEmitter();  
    
  address: any = {
    place: '',
    set: false,
  };
  placesService: any;
  map: any;
  markers = [];
  placedetails: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,    
    public modalCtrl: ModalController ) {
  }

  ionViewDidLoad() { }

  private initPlacedetails() {
    this.placedetails = {
      address: '',
      lat: '',
      lng: '',
      components: {
        route: { set: false, short: '', long: '' },                           // calle 
        street_number: { set: false, short: '', long: '' },                   // numero
        sublocality_level_1: { set: false, short: '', long: '' },             // barrio
        locality: { set: false, short: '', long: '' },                        // localidad, ciudad
        administrative_area_level_2: { set: false, short: '', long: '' },     // zona/comuna/partido 
        administrative_area_level_1: { set: false, short: '', long: '' },     // estado/provincia 
        country: { set: false, short: '', long: '' },                         // pais
        postal_code: { set: false, short: '', long: '' },                     // codigo postal
        postal_code_suffix: { set: false, short: '', long: '' },              // codigo postal - sufijo
      }
    };
  }

  private reset() {
    this.initPlacedetails();
    this.address.place = '';
    this.address.set = false;
  }

  showModal() {
    // reset 
    this.reset();
    // show modal|
    let modal = this.modalCtrl.create("AdressSearchPage");
    modal.onDidDismiss(data => {
      console.log('page > modal dismissed > data > ', data);
      if (data) {
        this.adressData.emit(data);
      }
    })
    modal.present();
  }

}
