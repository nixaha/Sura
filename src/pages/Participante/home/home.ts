import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventosPage } from '../eventos/eventos';
import { MuseoPage } from '../museo/museo';
import { QmasvisitarPage } from '../qmasvisitar/qmasvisitar';
import { RestaurantePage } from '../restaurante/restaurante';
import { SouvePage } from '../souve/souve';
import { HotelesPage } from '../hoteles/hoteles';
import { GaleriaPage } from '../galeria/galeria';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  vereventoss() {
    this.navCtrl.push(EventosPage);
   
  }
  vermuseos() {
    this.navCtrl.push(MuseoPage);
   
  }
  verrestaurantes() {
    this.navCtrl.push(RestaurantePage);
   
  }
  qmasvisitar() {
    this.navCtrl.push(QmasvisitarPage);
   
  }
  
  souvenirs() {
    this.navCtrl.push(SouvePage);
   
  }
  
  verhoteles() {
    this.navCtrl.push(HotelesPage);
   
  }
  vergaleria() {
    this.navCtrl.push(GaleriaPage);
   
  }
  
  
  
}
