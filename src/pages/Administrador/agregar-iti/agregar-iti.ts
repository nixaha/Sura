import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

import { Itinerario } from "../../../shared/models/itinerario.model";

import { strings } from "../../../shared/consts/strings.const";

@Component({
  selector: "page-agregar-iti",
  templateUrl: "agregar-iti.html"
})
export class AgregarItiPage {
  public itinerario = {} as Itinerario;
  public eventoId: string;
  public horarioValido: boolean;

  public tiposIti = strings.registroItinerarioCatalogos.tipos;
  public fechasDisponibles: Array<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.eventoId = this.navParams.get("eventoId");
    this.horarioValido = true;
    const fechaInicio = this.navParams.get("fechaInicio");
    const fechaFin = this.navParams.get("fechaFin");
    this.cargarFechasDisponibles(fechaInicio, fechaFin);
  }

  cargarFechasDisponibles(fechaInicio, fechaFin) {
    this.fechasDisponibles = [];
    const dia = 1000 * 60 * 60 * 24;
    const fechaInicioDias = new Date(fechaInicio).getTime();
    const fechaFinDias = new Date(fechaFin).getTime();
    const dias = Math.round((fechaFinDias - fechaInicioDias) / dia);
    for (let i = 0; i <= dias; i++) {
      const fechaDisponible = new Date(fechaInicio);
      fechaDisponible.setUTCDate(fechaDisponible.getUTCDate()+i);
      const dia = fechaDisponible.getUTCDate();
      const mes = fechaDisponible.getUTCMonth() + 1;
      const diaFormat = (dia < 10) ? `0${dia}` : `${dia}`;
      const mesFormat = (mes < 10) ? `0${mes}` : `${mes}`;
      this.fechasDisponibles.push(`${fechaDisponible.getFullYear()}-${mesFormat}-${diaFormat}`);
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AgregarItiPage");
  }

  guardar() {
    this.itinerario.eventoId = this.eventoId;
    this.messagesService.showLoadingMessage("Registrando itinerario...");
    this.adminService.createItinerario(this.itinerario).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.navCtrl.pop();
        this.messagesService.showToastMessage(
          "Itinerario registrado exitosamente"
        );
      },
      error => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorItinerarioMessage(error.code),
          ["Aceptar"]
        );
      }
    );
  }

  validarHorario() {
    if (this.itinerario.horaInicio && this.itinerario.horaFin) {
      const horaInicio = this.itinerario.horaInicio.split(":");
      const horaFin = this.itinerario.horaFin.split(":");
      const minutosInicio = Number(horaInicio[0]) * 60 + Number(horaInicio[1]);
      const minutosFin = Number(horaFin[0]) * 60 + Number(horaFin[1]);
      if (minutosInicio >= minutosFin) {
        this.horarioValido = false;
      } else {
        this.horarioValido = true;
      }
    }
  }
}
