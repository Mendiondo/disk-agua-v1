import { Injectable, ViewChild } from '@angular/core';
import { Profile } from '../../models/profile';
import { Distributor } from '../../models/distributor';
import { AngularFireAuth } from 'angularfire2/auth';
import { CloudMessagingProvider } from '../cloud-messaging/cloud-messaging';
import { NavController, Nav } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { MyApp } from '../../app/app.component';

@Injectable()
export class UserAuthServiceProvider {
  //@ViewChild(Nav) nav: Nav;

  uid: string;
  tokenPushNotification: string;

  constructor(public afAuth: AngularFireAuth,
    public platform: Platform,
    //public navCtrl: NavController,
    // public myApp: MyApp,
    public cloudMessaging: CloudMessagingProvider) { }

  setUserID(uid: string) {
    this.uid = uid;
  }
  
  getUserID(): string {
    return this.uid;
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
