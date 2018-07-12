import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile';
import { Distributor } from '../../models/distributor';


@Injectable()
export class UserAuthServiceProvider {

  uid: string;

  setUserID(uid: string) {
    this.uid = uid;
  }
  
  getUserID(): string {
    return this.uid;
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

}
