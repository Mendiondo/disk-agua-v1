import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Order } from '../../models/order';
import { Observable } from 'rxjs/Observable';
import { Adress } from '../../models/adress';
import { Distributor } from '../../models/distributor';

@Injectable()
export class DistributorServiceProvider {

  constructor(private afDatabase: AngularFireDatabase) {
    console.log('Hello DistributorServiceProvider Provider');
  }

  distributorByAdress(fullAdress: string): Observable<Adress> {
    return (this.afDatabase.object(`distributor-by-adress/${fullAdress}`).valueChanges() as Observable<Adress>).take(1);
  }

  distributorById(fullAdress: string, adress: Adress): Observable<Distributor> {
    return (this.afDatabase.object(`distributor-by-id/${adress.distributorId1}/${fullAdress}`)
      .valueChanges() as Observable<Distributor>).take(1);
  }

  getDistributor(uid: string): Observable<Distributor> {
    return (this.afDatabase.object(`distributor/${uid}`).valueChanges() as Observable<Distributor>).take(1);
  }

  getFullAdress(order: Order) {
    return order.user.street + "_" + order.user.district + "_" + order.user.city;
  }

}
