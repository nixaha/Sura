import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-eliminar-iti',
  templateUrl: 'eliminar-iti.html',
})
export class EliminarItiPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EliminarItiPage');
  }

}
