import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-ecoturismo-list',
  templateUrl: 'ecoturismo-list.html',
})
export class EcoturismoListPage {

  ecoturismo:any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ecoturismo= this.navParams.get('id');
  }


}
