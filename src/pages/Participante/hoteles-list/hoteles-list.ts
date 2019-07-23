import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-hoteles-list',
  templateUrl: 'hoteles-list.html',
})
export class HotelesListPage {
  hotel:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.hotel= this.navParams.get('id');

    
  }

}
