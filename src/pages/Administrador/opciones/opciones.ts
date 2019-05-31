import { Component } from "@angular/core";
import { NavController, NavParams, App } from "ionic-angular";

import { EventosAdminPage, LogInPage } from "../../index.paginas";

import { MessagesService } from "../../../services/index.services";

@Component({
  selector: "page-opciones",
  templateUrl: "opciones.html"
})
export class OpcionesPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private messagesService: MessagesService,
    private app: App
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad OpcionesPage");
  }

  eventos() {
    this.navCtrl.push(EventosAdminPage);
  }

  logout() {
    this.messagesService.showMessage(
      "Cerrar sesión",
      "¿Desea salir de su cuenta?",
      [
        {
          text: "Aceptar",
          handler: () => {
            localStorage.clear();
            this.app.getRootNav().setRoot(LogInPage);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    );
  }
}
