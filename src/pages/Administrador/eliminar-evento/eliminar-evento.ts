import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-eliminar-evento',
  templateUrl: 'eliminar-evento.html',
})
export class EliminarEventoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EliminarEventoPage');
  }

}
