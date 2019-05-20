import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { OpcionesPage } from "../opciones/opciones";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

import { Evento } from "../../../shared/models/evento.model";

@Component({
  selector: "page-agregar-evento",
  templateUrl: "agregar-evento.html"
})
export class AgregarEventoPage {
  public evento = {} as Evento;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad AgregarEventoPage");
  }

  guardar() {
    this.messagesService.showLoadingMessage("Registrando evento...");
    this.adminService.createEvento(this.evento).then(
      result => {
        console.log("guardado");
        this.messagesService.hideLoadingMessage();
        this.navCtrl.setRoot(OpcionesPage);
        this.messagesService.showToastMessage("Evento registrado exitosamente");
      },
      error => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorEventoMessage(error.code),
          ["Aceptar"]
        );
      }
    );
  }
}
