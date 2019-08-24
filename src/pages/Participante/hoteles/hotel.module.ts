import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotelesPage } from './hoteles';
// import { PipesModule } from '../../../pipes/pipes.module';


@NgModule({
  declarations: [
    HotelesPage,
  ],
  imports: [
    IonicPageModule.forChild(HotelesPage),
    // PipesModule
  ],
})
export class HotelesPageModule {}
