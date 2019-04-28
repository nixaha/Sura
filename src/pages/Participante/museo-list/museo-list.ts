import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';


@Component({
  selector: 'page-museo-list',
  templateUrl: 'museo-list.html',
})
export class MuseoListPage {
  museo:any = {};
  //data = { nombre: '', description: '', horarios: '', costo: '', direccion: '', telefono: '', foto: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams);
    this.museo= this.navParams.get('id');
  }

}
