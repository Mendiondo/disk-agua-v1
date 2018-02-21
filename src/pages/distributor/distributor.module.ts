import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DistributorPage } from './distributor';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DistributorPage,
  ],
  imports: [
    IonicPageModule.forChild(DistributorPage),
    ComponentsModule,
  ],
})
export class DistributorPageModule {}
