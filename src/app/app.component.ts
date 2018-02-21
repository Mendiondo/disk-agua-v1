import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserAuthServiceProvider } from '../providers/user-auth-service/user-auth-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public afAuth: AngularFireAuth,
    public userAuthService: UserAuthServiceProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [      
      { title: 'Cadastro', component: "ProfilePage" },
      { title: 'Produtos', component: "ProductPage" },
      { title: 'Distribuidor', component: "DistributorPage" },
      { title: 'Comprar', component: "AddProductPage" }
    ];

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
      if (user) {
        if(this.platform.is('cordova')) {
          console.log("Cordova");
          this.rootPage = "AddProductPage";
        } else {
          console.log("Not Cordova");
          this.rootPage = "DistributorPage";
        }  
        this.userAuthService.setUserID(user.uid);
        console.log("uid - " + user.uid);
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

  showMenu(): boolean {
    if (this.rootPage == "LoginPage") {
      console.log("1");
      return false;
    }
    console.log("2");
    return true;
  }
}
