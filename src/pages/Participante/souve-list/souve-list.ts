import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-souve-list',
  templateUrl: 'souve-list.html',
})
export class SouveListPage {
  souvenir: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {


    this.souvenir = this.navParams.get('id');

    console.log(navParams + 'imagen souvenir list ts');

  }


}
