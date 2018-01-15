import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ListPage } from '../pages/list/list';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public afAuth: AngularFireAuth) {
    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {                
        this.rootPage = "AddProductPage";
        authObserver.unsubscribe();        
      } else {
        this.rootPage = 'LoginPage';
        authObserver.unsubscribe();        
      }
    });

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [      
      { title: 'Cadastro', component: "ProfilePage" },
      { title: 'Produtos', component: "DistributorPage" },
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
