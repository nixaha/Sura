import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from "../../../shared/models/user";

@Component({
  selector: 'page-restablecer-contra',
  templateUrl: 'restablecer-contra.html',
})
export class RestablecerContraPage {
  user = {} as User;
  email: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestablecerContraPage');
  }

}
