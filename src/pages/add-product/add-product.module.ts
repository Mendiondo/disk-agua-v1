import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProductPage } from './add-product';
import { TooltipsModule } from 'ionic-tooltips';

@NgModule({
  declarations: [
    AddProductPage,
  ],
  imports: [
    IonicPageModule.forChild(AddProductPage),
    TooltipsModule,
  ],
})
export class AddProductPageModule {}
