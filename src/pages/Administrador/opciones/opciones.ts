import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { AgregarEventoPage } from "../agregar-evento/agregar-evento";
import { EditarEventoPage } from "../editar-evento/editar-evento";
import { ItinerariosPage } from "../itinerarios/itinerarios";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

import { Evento } from "../../../shared/models/evento.model";

@Component({
  selector: "page-opciones",
  templateUrl: "opciones.html"
})
export class OpcionesPage {
  public eventos: Array<Evento>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {}

  cargarEventos() {
    this.eventos = [];
    this.messagesService.showLoadingMessage("Cargando eventos...");
    this.adminService.getEventos().then(
      result => {
        result.forEach(doc => {
          this.eventos.push(doc.data());
          console.log(doc, doc.data());
        });
        this.messagesService.hideLoadingMessage();
      },
      error => {
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorEventoMessage(error.code),
          ["Aceptar"]
        );
        this.messagesService.hideLoadingMessage();
        console.log(error);
      }
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad OpcionesPage");
  }

  ionViewWillEnter() {
    this.cargarEventos();
  }

  agregareventoo() {
    this.navCtrl.push(AgregarEventoPage);
  }
  editarevento(index) {
    this.navCtrl.push(EditarEventoPage, { evento: this.eventos[index] });
    console.log(this.eventos[index]);
  }

  eliminarevento(index) {
    this.messagesService.showMessage("Eliminar", "¿Está seguro de eliminar?", [
      {
        text: "Aceptar",
        handler: () => {
          this.confirmarEliminarEvento(index);
        }
      },
      {
        text: "Cancelar"
      }
    ]);
  }

  confirmarEliminarEvento(index) {
    this.messagesService.showLoadingMessage("Eliminando evento...");
    this.adminService.deleteEvento(this.eventos[index]).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showToastMessage("Evento eliminado");
        this.cargarEventos();
      },
      error => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorEventoMessage(error.code),
          ["Aceptar"]
        );
        console.log(error);
      }
    );
  }

  agregarItinerarios(index) {
    this.navCtrl.push(ItinerariosPage, { eventoId: this.eventos[index].id });
  }
}
