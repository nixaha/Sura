import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-qmasvisitar-list',
  templateUrl: 'qmasvisitar-list.html',
})
export class QmasvisitarListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QmasvisitarListPage');
  }

}
