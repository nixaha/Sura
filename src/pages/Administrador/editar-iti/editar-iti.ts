import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";
import { Itinerario } from "../../../shared/models/itinerario.model";

@Component({
  selector: "page-editar-iti",
  templateUrl: "editar-iti.html"
})
export class EditarItiPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.itinerario = navParams.get("itinerario");
  }

  public itinerario = {} as Itinerario;
  public horarioValido: boolean;

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
