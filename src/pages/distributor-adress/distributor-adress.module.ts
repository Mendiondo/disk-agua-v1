import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DistributorAdressPage } from './distributor-adress';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DistributorAdressPage,
  ],
  imports: [
    IonicPageModule.forChild(DistributorAdressPage),
    ComponentsModule,
  ],
})
export class DistributorAdressPageModule {}
