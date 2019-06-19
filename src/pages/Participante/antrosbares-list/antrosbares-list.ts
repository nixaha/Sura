import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-antrosbares-list',
  templateUrl: 'antrosbares-list.html',
})
export class AntrosbaresListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AntrosbaresListPage');
  }

}
