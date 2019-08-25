import { Component } from "@angular/core";
import { NavController, NavParams, App } from "ionic-angular";

import { EventosAdminPage, LogInPage, EliminarItiPage } from "../../index.paginas";

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
  ) { }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OpcionesPage");
  }

  eventos() {
    this.navCtrl.push(EventosAdminPage);
  }
  galeria() {
    this.navCtrl.push(EliminarItiPage);
  }

  logout() {
    this.messagesService.showMessage(
      "Cerrar sesión",
      "¿Desea cerrar sesión?",
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
