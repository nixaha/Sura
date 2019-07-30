import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-antrosbares-list',
  templateUrl: 'antrosbares-list.html',
})
export class AntrosbaresListPage {

  antros:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.antros= this.navParams.get('id');
  }

}
