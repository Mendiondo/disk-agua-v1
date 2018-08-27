import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Firebase } from '@ionic-native/firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { TooltipsModule } from 'ionic-tooltips';
import { ComponentsModule } from '../components/components.module';
import { AdressListServiceProvider } from '../providers/adress-list-service/adress-list-service';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';
import { BasketServiceProvider } from '../providers/basket-service/basket-service';
import { CloudMessagingProvider } from '../providers/cloud-messaging/cloud-messaging';
import { DistributorServiceProvider } from '../providers/distributor-service/distributor-service';
import { OrderServiceProvider } from '../providers/order-service/order-service';
import { UserAuthServiceProvider } from '../providers/user-auth-service/user-auth-service';
import { MyApp } from './app.component';
import { FIREBASE_CONFIG } from './app.firebase.config';



@NgModule({
  declarations: [
    MyApp    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TooltipsModule,
    ComponentsModule
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
    AdressListServiceProvider,
    AlertServiceProvider,
    Firebase,
    CloudMessagingProvider,
    OrderServiceProvider,
    DistributorServiceProvider
  ]
})
export class AppModule {}
