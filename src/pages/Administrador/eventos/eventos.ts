import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

import { AgregarEventoPage } from "../agregar-evento/agregar-evento";
import { EditarEventoPage } from "../editar-evento/editar-evento";
import { ItinerariosPage } from "../itinerarios/itinerarios";

import { Evento } from "../../../shared/models/evento.model";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

@Component({
  selector: "page-eventos",
  templateUrl: "eventos.html"
})
export class EventosAdminPage {
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

  consultarEliminarevento(index) {
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
    this.messagesService.showMessage(
      "Eliminar",
      "¿Está realmente seguro de eliminar?",
      [
        {
          text: "Aceptar",
          handler: () => {
            this.eliminarImagen(index);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    );
  }

  eliminarImagen(index) {
    this.adminService.deleteImage(this.eventos[index].imagenId).then(
      result => {
        this.eliminarEvento(index);
      },
      error => {
        this.messagesService.showMessage(
          "Error",
          "Error al intentar eliminar imagen",
          ["Aceptar"]
        );
      }
    );
  }

  eliminarEvento(index) {
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
      }
    );
  }

  agregarItinerarios(index) {
    this.navCtrl.push(ItinerariosPage, {
      eventoId: this.eventos[index].id,
      fechaInicio: this.eventos[index].fechaInicio,
      fechaFin: this.eventos[index].fechaFin
    });
  }
}
