import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { EventosAdminPage } from "../eventos/eventos";

@Component({
  selector: "page-opciones",
  templateUrl: "opciones.html"
})
export class OpcionesPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad OpcionesPage");
  }

  eventos() {
    this.navCtrl.push(EventosAdminPage);
  }
}
