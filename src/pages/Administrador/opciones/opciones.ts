import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AgregarEventoPage } from '../agregar-evento/agregar-evento';
import { EditarEventoPage } from '../editar-evento/editar-evento';
import { EliminarEventoPage } from '../eliminar-evento/eliminar-evento';

@Component({
  selector: 'page-opciones',
  templateUrl: 'opciones.html',
})
export class OpcionesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpcionesPage');
  }
  agregareventoo() {
    this.navCtrl.push(AgregarEventoPage);
   
  }
  editarevento() {
    this.navCtrl.push(EditarEventoPage);
 
  }

  eliminarevento() {
    this.navCtrl.push(EliminarEventoPage);
   
  }


}
