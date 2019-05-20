import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItinerariosPage } from './itinerarios';

@NgModule({
  declarations: [
    ItinerariosPage,
  ],
  imports: [
    IonicPageModule.forChild(ItinerariosPage),
  ],
})
export class ItinerariosPageModule {}
