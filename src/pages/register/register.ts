import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;

  constructor(private auth: AngularFireAuth,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private alertService: AlertServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user: User) {
    try {
      const result = await this.auth.auth.createUserWithEmailAndPassword(user.email, user.password).then(()=>{
        this.alertService.showAlert("Aviso", "Cadastro realizado com sucesso!!!");
        this.navCtrl.setRoot('LoginPage');
      }).catch(()=>{
        this.redirectErrorOnRegister();
      })
      console.log(result);
    } catch (e) {
      this.redirectErrorOnRegister();      
    }
  }
  
  redirectErrorOnRegister() {
    this.alertService.showAlert("Aviso", "Falha ao realizar o cadastro");
    this.navCtrl.setRoot('LoginPage');    
  }

  backToLogin() {
    this.navCtrl.push('LoginPage');
  }

}
