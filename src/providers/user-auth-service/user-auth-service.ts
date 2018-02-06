import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UserAuthServiceProvider {

  uid: any;

  constructor(private auth: AngularFireAuth) {
    this.uid = "";
  }

  setState() {
    this.auth.authState.subscribe(auth => {                
      this.uid = auth.uid
    });
  }

}
