import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Nav, Events, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';
import { DistributorServiceProvider } from '../../providers/distributor-service/distributor-service';
import { CloudMessagingProvider } from '../../providers/cloud-messaging/cloud-messaging';
import { Roles } from '../../models/roles';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any}>;
  pagesClient: Array<{title: string, component: any}>;
  pagesDistributor: Array<{title: string, component: any}>;
  pagesAdmin: Array<{title: string, component: any}>;
  isShowMenu: boolean;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public platform: Platform, 
    private appCtrl: App, 
    public afAuth: AngularFireAuth,
    public userAuthService: UserAuthServiceProvider,
    public events: Events,
    private distributorService: DistributorServiceProvider,
    public cloudMessaging: CloudMessagingProvider) {
      
      // app.component.ts page (listen for the user created event after function is called)
      events.subscribe('user:created', (user, time) => {
        // user and time are the same arguments passed in `events.publish(user, time)`
        this.isShowMenu = true;
        console.log('Welcome', user, 'at', time);
        const authObserver = this.afAuth.authState.subscribe( userAuth => {
          this.loadUser(userAuth.uid, userAuth.email);
        });
      });
  }

  ionViewDidLoad() {
    this.pagesClient = [      
      { title: 'Cadastro', component: "ProfilePage" },
      { title: 'Comprar', component: "AddProductPage" },
      { title: 'Dê sua opnião', component: "CustomerSatisfactionPage" }
    ];
    
    this.pagesDistributor = [
      { title: 'Cadastro', component: "ProfilePage" },
      { title: 'Pedidos', component: "OrderListPage" }
    ];

    this.pagesAdmin = [
      { title: 'Produtos', component: "ProductPage" },
      { title: 'Distribuidor', component: "DistributorPage" },
      { title: 'Endereços', component: "DistributorAdressPage" }      
    ];
    this.login();  
  }

  login() {
    const authObserver = this.afAuth.authState.subscribe( user => {
      if(this.platform.is('cordova')) {
        console.log("Cordova");        
        this.cloudMessaging.getToken(user.uid);
      } else {
        console.log("Not Cordova");        
      }  
      if (user) {
        this.isShowMenu = true;
        this.loadUser(user.uid, user.email);

        if(this.platform.is('cordova')) {          
          this.cloudMessaging.listenToNotifications()
          .subscribe((res) => {
              if (res.tap) {
                // since firebase sends always string as data you have to parse it
                let data = JSON.parse(res.data)              
                console.log(data);
              }
          })
        }
      } else {
        this.appCtrl.getRootNav().rootPage = 'LoginPage';
        this.isShowMenu = false;
      }
      authObserver.unsubscribe();        
    });
  }

  loadUser(uid: string, email: string) {
    this.userAuthService.setUserID(uid);
    this.userAuthService.getProfileById(uid).subscribe(client => {
      console.log("Aqui");
      if (email === 'slawrows@gmail.com') {        
        this.userAuthService.setUserRole(Roles.ADMIN);
        this.appCtrl.getRootNav().rootPage = "DistributorAdressPage";
        this.pages = this.pagesAdmin;
        console.log("Admin");
      } else if (client) {
        this.userAuthService.setProfile(client);
        this.userAuthService.setUserRole(Roles.CLIENT);
        this.appCtrl.getRootNav().rootPage = "AddProductPage";
        this.pages = this.pagesClient;
        console.log(client);
      } else {       
          this.userAuthService.setProfile(client);          
          this.userAuthService.setUserRole(Roles.DISTRIBUTOR);
          this.appCtrl.getRootNav().rootPage = "OrderListPage";
          this.pages = this.pagesDistributor;       
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {    
    this.isShowMenu = false;
    this.afAuth.auth.signOut().then(auth => {
      this.nav.setRoot('LoginPage');
    }).catch((e) => console.error(e));
  }

}
