import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../models/order';
import { OrderStatus } from '../../models/order-status';
import { Product } from '../../models/product';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { BasketServiceProvider } from '../../providers/basket-service/basket-service';
import { DistributorServiceProvider } from '../../providers/distributor-service/distributor-service';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails } from '@ionic-native/paypal';


@IonicPage()
@Component({
  selector: 'page-basket',
  templateUrl: 'basket.html',
})
export class BasketPage {
  order = {} as Order;
  products: Product[];
  paymentMethod: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private basketService: BasketServiceProvider,
    private auth: AngularFireAuth,
    private userAuthService: UserAuthServiceProvider,
    private alertService: AlertServiceProvider,
    private distributorService: DistributorServiceProvider,
    private payPal: PayPal) {
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
    this.userAuthService.getProfileById(userId)
      .subscribe(profile => {
        let date = new Date();
        this.order.user = profile;        
        this.order.dtOrder = date.toUTCString();
        this.order.status = OrderStatus.EM_ABERTO;

        let fullAdress = this.distributorService.getFullAdress(this.order);
        this.distributorService.distributorByAdress(fullAdress).subscribe(adress => {
          this.order.adress = adress;
          this.order.distributorAdressLevel = 1;
          if (this.paymentMethod == "dinheiro") {
            this.createOrder(this.order, userId);
          } else if (this.paymentMethod == "cartao") {
            this.checkoutViaPayPal(this.order, userId);
          }
        });
      }, error => {
        this.alertService.showAlert("Alerta", "Favor atualizar seu cadastro!");
        return;
      });
  }

  createOrder(order: Order, userId: string) {
    this.basketService.createOrder(this.order, userId).then(() => {
      this.alertService.showAlert("Aviso", "Compra efetuada com sucesso!!!");
      this.basketService.sendPushToDistributor(this.order, userId);
      this.navCtrl.setRoot("AddProductPage");
    });
  }

  checkoutViaPayPal(order: Order, userId: string) {
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'AffEqAP6HQKjh_hA2kHIHTtYclxpUqhsuwiDxATYx8hiDRmj7b3PKvPSZWeacjn3rP2Y5qAbvJsUAVqP'
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        acceptCreditCards: true,
        languageOrLocale: 'pt-BR',
        merchantName: 'App Agua Santa Catarina',
        merchantPrivacyPolicyURL: '',
        merchantUserAgreementURL: ''
      })).then(() => {
        let payment = new PayPalPayment(this.order.total.toString(), 'BRL', 'Nova compra no App Agua Santa Catarina', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
          this.createOrder(this.order, userId);
        }, () => {
          // Error or render dialog closed without being successful
          this.alertService.showAlert("Aviso", "Error!!!");
        });
      }, () => {
        // Error in configuration
        this.alertService.showAlert("Aviso", "Error in config!!!");
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      this.alertService.showAlert("Aviso", "Error in initialize!!!");
    }
    );
  }

  goBack() {
    this.navCtrl.pop();
  }

}
