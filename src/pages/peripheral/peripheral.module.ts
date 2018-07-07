import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeripheralPage } from './peripheral';

@NgModule({
  declarations: [
    PeripheralPage,
  ],
  imports: [
    IonicPageModule.forChild(PeripheralPage),
  ],
})
export class PeripheralPageModule {}
