import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { OpcionesPage } from "../opciones/opciones";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";
import { Evento } from "../../../shared/models/evento.model";

@Component({
  selector: "page-editar-evento",
  templateUrl: "editar-evento.html"
})
export class EditarEventoPage {
  public evento = {} as Evento;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.evento = navParams.get("evento");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EditarEventoPage");
  }

  editar() {
    this.messagesService.showLoadingMessage("Actualizando evento...");
    this.adminService.updateEvento(this.evento).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showToastMessage("Evento actualizado");
        this.navCtrl.setRoot(OpcionesPage);
      },
      error => {
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorEventoMessage(error.code),
          ["Aceptar"]
        );
        console.log(error);
      }
    );
  }
}
