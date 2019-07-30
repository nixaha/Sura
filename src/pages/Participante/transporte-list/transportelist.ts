import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
 selector: 'transportelist',
    templateUrl: 'transporte-list.html',                   
})
export class TransporteListPage {
 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransporteListPage');
  }

}