import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserAuthServiceProvider } from '../../providers/user-auth-service/user-auth-service';
import { CloudMessagingProvider } from '../../providers/cloud-messaging/cloud-messaging';

@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;
  pagesClient: Array<{title: string, component: any}>;
  pagesDistributor: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public afAuth: AngularFireAuth,
    public userAuthService: UserAuthServiceProvider,
    public cloudMessaging: CloudMessagingProvider) {    

    // used for an example of ngFor and navigation
    this.pagesClient = [      
      { title: 'Cadastro', component: "ProfilePage" },
      { title: 'Comprar', component: "AddProductPage" }
    ];
    
    this.pagesDistributor = [
      { title: 'Cadastro', component: "ProfilePage" },
      { title: 'Produtos', component: "ProductPage" },
      { title: 'Distribuidor', component: "DistributorPage" },
      { title: 'Endereços', component: "DistributorAdressPage" },
      { title: 'Pedidos', component: "OrderListPage" },
    ];

  }

  login() {
    const authObserver = this.afAuth.authState.subscribe( user => {
      if(this.platform.is('cordova')) {
        console.log("Cordova");
        this.rootPage = "AddProductPage";
        this.pages = this.pagesClient;
        this.cloudMessaging.getToken(user.uid);
      } else {
        console.log("Not Cordova");
        this.rootPage = "DistributorPage";
        this.pages = this.pagesClient;
      }  
      if (user) {
        this.userAuthService.setUserID(user.uid);               

        this.cloudMessaging.listenToNotifications()
        .subscribe((res) => {
            if (res.tap) {
              // since firebase sends always string as data you have to parse it
              let data = JSON.parse(res.data)              
              console.log(data);
            }
        })
      } else {
        this.rootPage = 'LoginPage';
      }
      authObserver.unsubscribe();        
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {    
    this.afAuth.auth.signOut().then(auth => {
      this.nav.setRoot('LoginPage');
    }).catch((e) => console.error(e));
  }
}
