import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from "../../../shared/models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { LogInPage } from "../../index.paginas"

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
  
  user = {} as User;
  logi: any = LogInPage;
  nombre: string= '';
  estado: string= '';
  email: string= '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

}
