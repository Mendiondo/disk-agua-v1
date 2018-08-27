import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerSatisfactionPage } from './customer-satisfaction';

@NgModule({
  declarations: [
    CustomerSatisfactionPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerSatisfactionPage),
  ],
})
export class CustomerSatisfactionPageModule {}
