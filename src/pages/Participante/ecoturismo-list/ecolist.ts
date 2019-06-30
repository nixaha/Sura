import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
   selector: 'ecoturismolist',
   templateUrl: 'ecolist.html',                   
})
export class EcoListPage {
 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EcoListPage');
  }

}