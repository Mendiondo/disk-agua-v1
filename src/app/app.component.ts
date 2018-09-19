import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserAuthServiceProvider } from '../providers/user-auth-service/user-auth-service';
import { CloudMessagingProvider } from '../providers/cloud-messaging/cloud-messaging';
import { Roles } from '../models/roles';
import { DistributorServiceProvider } from '../providers/distributor-service/distributor-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;
  pagesClient: Array<{title: string, component: any}>;
  pagesDistributor: Array<{title: string, component: any}>;
  pagesAdmin: Array<{title: string, component: any}>;
  isShowMenu: boolean;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public afAuth: AngularFireAuth,
    public userAuthService: UserAuthServiceProvider,
    public events: Events,
    private distributorService: DistributorServiceProvider,
    public cloudMessaging: CloudMessagingProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
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
      { title: 'Cadastro', component: "ProfilePage" },
      { title: 'Produtos', component: "ProductPage" },
      { title: 'Distribuidor', component: "DistributorPage" },
      { title: 'Endereços', component: "DistributorAdressPage" }      
    ];

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

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      //this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#FF6600');
      this.splashScreen.hide();
      this.login();      
      
    });
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
        this.rootPage = 'LoginPage';
        this.isShowMenu = false;
      }
      authObserver.unsubscribe();
    });
  }

  loadUser(uid: string, email: string) {
    this.userAuthService.setUserID(uid);
    this.userAuthService.getProfileById(uid).subscribe(profile => {
      if (profile == null || profile.role == null) {
        this.rootPage = "ProfilePage";
        console.log("No roles!!!");
      } else if (profile.role == Roles.ADMIN) {        
        this.userAuthService.setUserRole(Roles.ADMIN);
        this.rootPage = "DistributorAdressPage";
        this.pages = this.pagesAdmin;
        console.log("Admin");
      } else if (profile.role == Roles.CLIENT) {
        this.userAuthService.setClient(profile);
        this.userAuthService.setUserRole(Roles.CLIENT);
        this.rootPage = "AddProductPage";
        this.pages = this.pagesClient;
        console.log("Client");
      } else if (profile.role == Roles.DISTRIBUTOR) {
        this.distributorService.getDistributor(uid).subscribe(distributor => {
          this.userAuthService.setDistributor(distributor);
          this.userAuthService.setUserRole(Roles.DISTRIBUTOR);
          this.rootPage = "OrderListPage";
          this.pages = this.pagesDistributor;
          console.log("Dist");
        })
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
