import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class OrderServiceProvider {

  constructor(private afDatabase: AngularFireDatabase) {
    console.log('Hello OrderServiceProvider Provider');
  }

}
