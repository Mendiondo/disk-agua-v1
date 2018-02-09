import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { Profile } from '../../models/profile';


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

  
  loadProfile(profileParam: any) {
    let profile = {} as Profile;

    profile.bairro = profileParam['bairro'];
    profile.cidade = profileParam['bairro'];
    profile.complemento = profileParam['complemento'];
    profile.email = profileParam['email'];
    profile.nomeCompleto = profileParam['nomeCompleto'];
    profile.numero = profileParam['numero'];
    profile.rua = profileParam['rua'];

    return profile;
}

}
