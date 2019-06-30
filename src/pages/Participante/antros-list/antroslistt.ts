import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
     selector: 'antroslist',
     templateUrl: 'antroslistt.html',                   
})
export class AntrosListPage {
 

 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AntrosListPage');
  }

}