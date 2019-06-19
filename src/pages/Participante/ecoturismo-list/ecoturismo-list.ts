import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-ecoturismo-list',
  templateUrl: 'ecoturismo-list.html',
})
export class EcoturismoListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EcoturismoListPage');
  }

}
