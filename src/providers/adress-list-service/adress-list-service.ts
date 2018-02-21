import { Injectable } from '@angular/core';
import { Adress } from '../../models/adress';

@Injectable()
export class AdressListServiceProvider {

  adressList: Adress[];

  constructor() {
    this.adressList = new Array();
  }

  add(adress: Adress) {
    this.adressList.push(adress);
  }
  
  remove(adress: Adress) {
    const index = this.adressList.indexOf(adress);
    if (index > -1)
      this.adressList.splice(index, 1);    
  }

  getList(): Adress[] {
    return this.adressList;
  }

  contains(adress: Adress): boolean {
    const index = this.adressList.indexOf(adress);
    if (index > -1) {
      return true;
    }
    return false;
  }
}
