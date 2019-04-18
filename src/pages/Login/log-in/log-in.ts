import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegistroPage, RestablecerContraPage } from "../../index.paginas"
import { User } from "../../../shared/models/user";

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  registro: any = RegistroPage;
  olvidar: any = RestablecerContraPage;
  
  user = {} as User;
  email: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogInPage');
  }

}
