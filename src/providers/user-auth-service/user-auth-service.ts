import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular/platform/platform';
import { Profile } from '../../models/profile';
import { CloudMessagingProvider } from '../cloud-messaging/cloud-messaging';
import { AngularFireDatabase } from 'angularfire2/database';
import { Distributor } from '../../models/distributor';
import { Adress } from '../../models/adress';
import { Observable } from 'rxjs/Observable';
import { DistributorServiceProvider } from '../distributor-service/distributor-service';
import { Roles } from '../../models/roles';

@Injectable()
export class UserAuthServiceProvider {
  //@ViewChild(Nav) nav: Nav;

  uid: string;
  client: Profile;
  distributor: Distributor;
  role: string;
  tokenPushNotification: string;

  constructor(public afAuth: AngularFireAuth,
    public platform: Platform,
    //public navCtrl: NavController,
    // public myApp: MyApp,
    private afDatabase: AngularFireDatabase,
    private distributorService: DistributorServiceProvider,
    public cloudMessaging: CloudMessagingProvider) { }

  setUserID(uid: string) {
    this.uid = uid;
  }
  
  getUserID(): string {
    return this.uid;
  }
  
  setClient(client: Profile) {
    this.client = client;
  }

  getClient(): Profile {
    return this.client;
  }
  
  setDistributor(distributor: Distributor) {
    this.distributor = distributor;
  }

  getDistributor(): Distributor {
    return this.distributor;
  }

  setUserRole(role: string) {
    this.role = role;
  }

  getUserRole(): string {
    return this.role;
  }
  
  loadUser(uid: string) {
    this.setUserID(uid); 
    this.getClientById(uid).subscribe(client => {
      console.log("Aqui");
      if (client) {
        this.client = client;
        this.setUserRole(Roles.CLIENT);
        console.log(client);
      } else {
        this.distributorService.getDistributor(uid).subscribe(distributor => {
          this.distributor = distributor;
          this.setUserRole(Roles.DISTRIBUTOR);
          console.log(distributor);
        })
      }
    });
  }

  getClientById(uid: string): Observable<Profile> {
    return this.afDatabase.object(`client/${uid}`).valueChanges().take(1) as Observable<Profile>
  }
  
  setUserTokenPushNotification(tokenPushNotification: string) {
    this.tokenPushNotification = tokenPushNotification;
  }
  
  getUserTokenPushNotification(): string {
    return this.tokenPushNotification;
  }
  
  loadProfile(profileParam: any) {
    //type User = Profile | Distributor;
    let profile = {} as Profile;

    profile.district = profileParam['district'];
    profile.city = profileParam['city'];
    profile.additionalAdress = profileParam['additionalAdress'];
    profile.email = profileParam['email'];
    profile.fullName = profileParam['fullName'];
    profile.number = profileParam['number'];
    profile.street = profileParam['street'];

    return profile;
  }

  login() {
    const authObserver = this.afAuth.authState.subscribe( user => {
      if (user) {
        this.setUserID(user.uid);               

        this.cloudMessaging.listenToNotifications()
        .subscribe((res) => {
            if (res.tap) {
              // since firebase sends always string as data you have to parse it
              let data = JSON.parse(res.data)              
              console.log(data);
            }
        })
        if(this.platform.is('cordova')) {
          console.log("Cordova");
         // this.navCtrl.setRoot("AddProductPage");
          // this.myApp.setClientMenu();
          this.cloudMessaging.getToken(user.uid);
        } else {
          console.log("Not Cordova");
         // this.navCtrl.setRoot("DistributorPage");
          // this.myApp.setDistributorMenu();
        }  
      } else {
       // this.navCtrl.setRoot('LoginPage');
      }
      authObserver.unsubscribe();        
    });
  }
  
  logout() {    
    this.afAuth.auth.signOut().then(auth => {
     // this.navCtrl.setRoot('LoginPage');
    }).catch((e) => console.error(e));
  }

}
