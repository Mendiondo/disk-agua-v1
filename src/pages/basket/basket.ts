import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';
import { Product } from '../../models/product';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Order } from '../../models/order';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { OrderStatus } from '../../models/order-status';
import { Adress } from '../../models/adress';


@IonicPage()
@Component({
  selector: 'page-basket',
  templateUrl: 'basket.html',
})
export class BasketPage {
  order = {} as Order; 
  products: Product[];  

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public basketService: BasketServiceProvider,
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth,
    public userAuthServiceProvider: UserAuthServiceProvider,
    private alertService: AlertServiceProvider,
    private http: HttpClient) {
  }

  ionViewDidLoad() {    
    this.products = this.basketService.getProducts()
      .filter(product => product.amount > 0);

    this.order.products = this.products;

    this.order.total = this.products
      .map(product => product.subTotal)
      .reduce((total, subTotal) => total + subTotal, 0)

    // .subscribe(totalPrice => this.total = totalPrice) 

    console.log('ionViewDidLoad BasketPage');

    // .reduce( (total,price) => total + price, 0)
  }

  sendPush() {
    return this.http.get('https://us-central1-disk-agua-santa-catarina.cloudfunctions.net/sendpush/')
      .subscribe(
        res => {
          console.log("Sendpush - " + res.toString);
        },
        msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
      );
  }

  checkout() {
    this.afDatabase.object(`client/${this.auth.auth.currentUser.uid}`).valueChanges().take(1)
      .subscribe(profileParam => {
        let date = new Date();

        this.order.user = this.userAuthServiceProvider.loadProfile(profileParam);
        this.order.id = date.toISOString();
        this.order.dtOrder = date;
        this.order.status = OrderStatus.EM_ABERTO;
        
        let fullAdress = this.order.user.street + "_" + this.order.user.district + "_" + this.order.user.city;
        this.afDatabase.object(`distributor-by-adress/${fullAdress}`).valueChanges().take(1)
        .subscribe(adress => {
          console.log(adress)
          //this.order.adress = adress.id;
          this.afDatabase.object(`distributor/${adress['distributorId1']}`).valueChanges().take(1)
          .subscribe(distributor => {
            //this.order.distributor = distributor;
            console.log(distributor);

          });

        });



        //this.afDatabase.object("orders/" + this.order.id).set(this.order)
        //.then(() => this.alertService.showAlert("Aviso", "Distribuidor salvo com sucesso"));

      }, error => {
        this.alertService.showAlert("Alerta", "Favor atualizar seu cadastro!");
        return;
      });
    this.order.products = this.products;    
  }

  goBack() {
    this.navCtrl.pop();
  }

  getCurrentTimeForID(): string {
    var date = new Date();
    console.log(date.getUTCMilliseconds().toString());
    return date.getUTCMilliseconds().toString();
  }


}
