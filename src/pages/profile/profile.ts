import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Profile } from '../../models/profile';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';

// declare var google: any;

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {

    profile = {} as Profile;
    profileData: Observable<Profile>

    isReadonly() {
        return true;
    }

    isAdressSelected() {
        return this.profile.street != null;
    }

    address: any = {
        place: '',
        set: false,
    };
    placesService: any;
    map: any;
    markers = [];
    placedetails: any;

    constructor(private auth: AngularFireAuth,
        private afDatabase: AngularFireDatabase,        
        public navCtrl: NavController,
        public navParams: NavParams,
        public userAuthServiceProvider: UserAuthServiceProvider,
        public modalCtrl: ModalController) {
    }

    ionViewWillLoad() {
        this.afDatabase.object(`client/${this.auth.auth.currentUser.uid}`).valueChanges().take(1)
        .subscribe(profileParam => {            
            if (profileParam != null && profileParam['email']) {
                this.profile = this.userAuthServiceProvider.loadProfile(profileParam);
                console.log("1  " + profileParam);
            } else {
                this.profile.email = this.auth.auth.currentUser.email;
                console.log("2  " + profileParam);
            }
        });
    }

    createProfile() {
        this.auth.authState.take(1).subscribe(auth => {
            this.afDatabase.object(`client/${auth.uid}`).set(this.profile)
                .then(() => this.navCtrl.setRoot("AddProductPage"))
        })
    }

    ngOnInit() {
        this.initPlacedetails();
    }

    showModal() {
        // reset 
        this.reset();
        // show modal|
        let modal = this.modalCtrl.create("AdressSearchPage");
        modal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if (data) {
                this.profile.adressId = data.id;
                this.profile.street = data.terms[0].value
                this.profile.district = data.terms[1].value
                this.profile.city = data.terms[2].value
            }
        })
        modal.present();
    }

    private reset() {
        this.initPlacedetails();
        this.address.place = '';
        this.address.set = false;
    }

    // private getPlaceDetail(place_id: string): void {
    //     var self = this;
    //     var request = {
    //         placeId: place_id
    //     };
    //     this.placesService = new google.maps.places.PlacesService(this.map);
    //     this.placesService.getDetails(request, callback);
    //     function callback(place, status) {
    //         if (status == google.maps.places.PlacesServiceStatus.OK) {
    //             console.log('page > getPlaceDetail > place > ', place);
    //             // set full address
    //             this.profile.endereco = place.formatted_address;

    //             // populate
    //             self.address.set = true;
    //             console.log('page > getPlaceDetail > details > ', self.placedetails);
    //         } else {
    //             console.log('page > getPlaceDetail > status > ', status);
    //         }
    //     }
    // }

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

}
