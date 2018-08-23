import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../models/order';
import { OrderStatus } from '../../models/order-status';
import { Product } from '../../models/product';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';
import { DistributorServiceProvider } from '../../providers/distributor-service/distributor-service';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';


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
    private basketService: BasketServiceProvider,
    private afDatabase: AngularFireDatabase,
    private auth: AngularFireAuth,
    private userAuthService: UserAuthServiceProvider,
    private alertService: AlertServiceProvider,
    private distributorService: DistributorServiceProvider) {
  }

  ionViewDidLoad() {
    this.products = this.basketService.getProducts()
      .filter(product => product.amount > 0);

    this.order.products = this.products;

    this.order.total = this.products
      .map(product => product.subTotal)
      .reduce((total, subTotal) => total + subTotal, 0)
  }

  checkout() {
    let userId = this.auth.auth.currentUser.uid;
    this.afDatabase.object(`client/${userId}`).valueChanges().take(1)
      .subscribe(profileParam => {
        let date = new Date();

        this.order.user = this.userAuthService.loadProfile(profileParam);
        this.order.dtOrder = date.toUTCString();
        this.order.status = OrderStatus.EM_ABERTO;

        let fullAdress = this.distributorService.getFullAdress(this.order);
        this.distributorService.distributorByAdress(fullAdress).subscribe(adress => {
            this.order.adress = adress;
            this.distributorService.distributorById(fullAdress, adress).subscribe(distributor => {
                this.order.distributor = distributor;
                console.log("distributor - " + distributor);
                                
                this.basketService.createOrder(this.order, userId).then(() =>{
                  this.alertService.showAlert("Aviso", "Compra efetuada com sucesso!!!");
                  this.basketService.sendPushToDistributor(this.order, userId);
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

  getShortOrder(order: Order, pushKey: string): Order {
    let shortOrder = {} as Order;
    shortOrder.dtOrder = order.dtOrder;
    shortOrder.status = order.status;
    shortOrder.status = order.status;
    shortOrder.id = pushKey;

    return shortOrder;
  }

}
