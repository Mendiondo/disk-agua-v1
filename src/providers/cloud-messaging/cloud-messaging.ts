import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Device } from '../../models/device';

@Injectable()
export class CloudMessagingProvider {

  constructor(
    public firebaseNative: Firebase,
    public auth: AngularFireAuth,
    public afDatabase: AngularFireDatabase,
    private platform: Platform
  ) { }

  device = {} as Device;

  // Get permission from the user
  async getToken(userid: string) {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
      console.log("FCM-android" + token);
    }
    
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }
    
    return this.saveToken(token, userid)
  }
  
  // Save the token
  private saveToken(token: string, userid: string) {
    if (!token) return;
    
    console.log("FCM-save" + token);
    this.initDevice(token, userid);
    this.afDatabase.object(`devices/${this.device.userid}`).set(this.device);
  }

  private initDevice(token: string, userid: string) {    
    this.device.userid = userid;
    this.device.token = token;    
  }

  // Listen to incoming FCM messages
  listenToNotifications() { 
    return this.firebaseNative.onNotificationOpen();
  }

}
