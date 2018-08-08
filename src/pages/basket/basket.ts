import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';
import { Product } from '../../models/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Order } from '../../models/order';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { OrderStatus } from '../../models/order-status';
import { Adress } from '../../models/adress';
import { Observable } from 'rxjs/Observable';
import { Distributor } from '../../models/distributor';
import { Device } from '../../models/device';


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
  }

  sendPush(token: string) {
    let params = '?token=' + token;
    params += '&title=Nova compra ' + this.order.user.fullName;
    params += '&body=' + this.order.products.map(product => product.amount + "x " + product.name + "\n");
    console.log(params);
    return this.http.get('https://us-central1-disk-agua-santa-catarina.cloudfunctions.net/sendpush/' + params)
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
        this.order.id = Math.ceil(Math.random() * Math.pow(10, 7));
        this.order.dtOrder = date;
        this.order.status = OrderStatus.EM_ABERTO;

        let fullAdress = this.order.user.street + "_" + this.order.user.district + "_" + this.order.user.city;
        (this.afDatabase.object(`distributor-by-adress/${fullAdress}`).valueChanges() as Observable<Adress>)
          .subscribe(adress => {
            console.log("adress - " + adress.distributorId1 + "%%" + adress.fullAdress);
            this.order.adress = adress;
            (this.afDatabase.object(`distributor-by-id/${adress.distributorId1}/${fullAdress}`).valueChanges() as Observable<Distributor>).take(1)
              .subscribe(distributor => {
                this.order.distributor = distributor;
                console.log("distributor - " + distributor);
                
                this.afDatabase.list("orders").push(this.order)
                // this.afDatabase.object("orders/" + this.order.id).set(this.order)
                  .then(() => {
                    this.alertService.showAlert("Aviso", "Compra efetuada com sucesso");
                    (this.afDatabase.object(`devices/${this.auth.auth.currentUser.uid}`).valueChanges() as Observable<Device>).take(1)
                    .subscribe(device => {      
                      console.log("Token: - " + device.token)                
                      this.sendPush(device.token);
                    });
                  });
              });

          });
      }, error => {
        this.alertService.showAlert("Alerta", "Favor atualizar seu cadastro!");
        return;
      });
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
