import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { Itinerario } from "../../../shared/models/itinerario.model";

import { AgregarItiPage } from "../agregar-iti/agregar-iti";
import { EditarItiPage } from "../editar-iti/editar-iti";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

@Component({
  selector: "page-itinerarios",
  templateUrl: "itinerarios.html"
})
export class ItinerariosPage {
  public itinerarios: Array<Itinerario>;
  public eventoId: string;
  public eventoFechaInicio: string;
  public eventoFechaFin: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.eventoId = navParams.get("eventoId");
    this.eventoFechaInicio = navParams.get("fechaInicio");
    this.eventoFechaFin = navParams.get("fechaFin");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ItinerariosPage");
  }

  cargarItinerarios() {
    this.itinerarios = [];
    this.messagesService.showLoadingMessage("Cargando itinerarios...");
    this.adminService.getItinerarios(this.eventoId).then(
      result => {
        result.forEach(doc => {
          this.itinerarios.push(doc.data());
          console.log(doc, doc.data());
        });
        this.messagesService.hideLoadingMessage();
      },
      error => {
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorItinerarioMessage(error.code),
          ["Aceptar"]
        );
        this.messagesService.hideLoadingMessage();
        console.log(error);
      }
    );
  }

  ionViewWillEnter() {
    this.cargarItinerarios();
  }

  agregarItinerario() {
    this.navCtrl.push(AgregarItiPage, {
      eventoId: this.eventoId,
      fechaInicio: this.eventoFechaInicio,
      fechaFin: this.eventoFechaFin
    });
  }

  editarItinerario(index) {
    this.navCtrl.push(EditarItiPage, {
      itinerario: this.itinerarios[index],
      fechaInicio: this.eventoFechaInicio,
      fechaFin: this.eventoFechaFin
    });
  }

  consultarEliminarItinerario(index) {
    this.messagesService.showMessage("Eliminar", "¿Está seguro de eliminar?", [
      {
        text: "Aceptar",
        handler: () => {
          this.confirmarEliminarItinerario(index);
        }
      },
      {
        text: "Cancelar"
      }
    ]);
  }

  confirmarEliminarItinerario(index) {
    this.messagesService.showMessage(
      "Eliminar",
      "¿Está realmente seguro de eliminar?",
      [
        {
          text: "Aceptar",
          handler: () => {
            this.eliminarItinerario(index);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    );
  }

  eliminarItinerario(index) {
    this.messagesService.showLoadingMessage("Eliminando itinerario...");
    this.adminService.deleteItinerario(this.itinerarios[index]).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showToastMessage("Itinerario eliminado");
        this.cargarItinerarios();
      },
      error => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorItinerarioMessage(error.code),
          ["Aceptar"]
        );
        console.log(error);
      }
    );
  }
}
