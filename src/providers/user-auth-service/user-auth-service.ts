import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';


@Injectable()
export class UserAuthServiceProvider {

  uid: string;

  constructor(private auth: AngularFireAuth) {    
  }

  setUserID(uid: string) {
    this.uid = uid;
  }
  
  getUserID(): string {
    return this.uid;
  }

}
