import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdressSearchPage } from './adress-search';

@NgModule({
  declarations: [
    AdressSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(AdressSearchPage),
  ],
})
export class AdressSearchPageModule {}
