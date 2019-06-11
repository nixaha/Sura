import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

import { Itinerario } from "../../../shared/models/itinerario.model";

import { strings } from "../../../shared/consts/strings.const";

@Component({
  selector: "page-editar-iti",
  templateUrl: "editar-iti.html"
})
export class EditarItiPage {

  public itinerario = {} as Itinerario;
  public horarioValido: boolean;

  public tiposIti = strings.registroItinerarioCatalogos.tipos;
  public fechasDisponibles: Array<any>;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.itinerario = navParams.get("itinerario");
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
    console.log("ionViewDidLoad EditarItiPage");
  }

  editar() {
    this.messagesService.showLoadingMessage("Actualizando itinerario...");
    this.adminService.updateItinerario(this.itinerario).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showToastMessage("Itinerario actualizado");
        this.navCtrl.pop();
      },
      error => {
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorItinerarioMessage(error.code),
          ["Aceptar"]
        );
        console.log(error);
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
