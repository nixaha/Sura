import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-qmasvisitar-list',
  templateUrl: 'qmasvisitar-list.html',
})
export class QmasvisitarListPage {
  quema:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.quema= this.navParams.get('id');
 
    console.log(navParams + 'imagen quema list ts');
  }

}
