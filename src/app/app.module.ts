import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
// import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { GooglePlus } from '@ionic-native/google-plus';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { BasketServiceProvider } from '../providers/basket-service/basket-service';
import { UserAuthServiceProvider } from '../providers/user-auth-service/user-auth-service';
import { AdressListServiceProvider } from '../providers/adress-list-service/adress-list-service';


@NgModule({
  declarations: [
    MyApp    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    BasketServiceProvider,
    UserAuthServiceProvider,
    AdressListServiceProvider,
    AdressListServiceProvider,
    AdressListServiceProvider
  ]
})
export class AppModule {}
