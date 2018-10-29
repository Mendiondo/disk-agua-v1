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
  profile: Profile;
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
  
  setProfile(client: Profile) {
    this.profile = client;
  }

  getProfile(): Profile {
    return this.profile;
  }

  setUserRole(role: string) {
    this.role = role;
  }

  getUserRole(): string {
    return this.role;
  }

  getProfileById(uid: string): Observable<Profile> {
    return this.afDatabase.object(`profile/${uid}`).valueChanges().take(1) as Observable<Profile>
  }
  
  setUserTokenPushNotification(tokenPushNotification: string) {
    this.tokenPushNotification = tokenPushNotification;
  }
  
  getUserTokenPushNotification(): string {
    return this.tokenPushNotification;
  }

}
