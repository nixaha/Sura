import { Component, ChangeDetectorRef } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

import { Itinerario } from "../../../shared/models/itinerario.model";

import { strings } from "../../../shared/consts/strings.const";
import { CCBRegions } from '../../../shared/consts/ccb.region.const'

@Component({
  selector: "page-agregar-iti",
  templateUrl: "agregar-iti.html"
})
export class AgregarItiPage {
  public itinerario = {} as Itinerario;
  public eventoId: string;
  public horarioValido: boolean;
  public ccb: boolean;

  public tiposIti = strings.registroItinerarioCatalogos.tipos;
  public ccbRegions = [];//CCBRegions;
  public fechasDisponibles: Array<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService,
    private cdRef: ChangeDetectorRef
  ) {
    this.eventoId = this.navParams.get("eventoId");
    this.horarioValido = true;
    this.ccb = false;
    const fechaInicio = this.navParams.get("fechaInicio");
    const fechaFin = this.navParams.get("fechaFin");
    this.cargarFechasDisponibles(fechaInicio, fechaFin);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  cargarFechasDisponibles(fechaInicio, fechaFin) {
    this.fechasDisponibles = [];
    const dia = 1000 * 60 * 60 * 24;
    const fechaInicioDias = new Date(fechaInicio).getTime();
    const fechaFinDias = new Date(fechaFin).getTime();
    const dias = Math.round((fechaFinDias - fechaInicioDias) / dia);
    for (let i = 0; i <= dias; i++) {
      const fechaDisponible = new Date(fechaInicio);
      fechaDisponible.setUTCDate(fechaDisponible.getUTCDate() + i);
      const dia = fechaDisponible.getUTCDate();
      const mes = fechaDisponible.getUTCMonth() + 1;
      const diaFormat = (dia < 10) ? `0${dia}` : `${dia}`;
      const mesFormat = (mes < 10) ? `0${mes}` : `${mes}`;
      this.fechasDisponibles.push(`${fechaDisponible.getFullYear()}-${mesFormat}-${diaFormat}`);
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AgregarItiPage");
    this.messagesService.showLoadingMessage('Cargando regiones CCB');
    this.adminService.getCcbRegions().then(
      result=>{
        result.forEach(doc => {
          this.ccbRegions.push(doc.data());
          console.log(doc, doc.data());
        });
        this.messagesService.hideLoadingMessage();
      },error=>{
        this.messagesService.showMessage('Error','No se cargaron las regiones del CCB',[]);
      }
    );
  }

  guardar() {
    this.itinerario.eventoId = this.eventoId;
    if (this.itinerario.ccbRegion) {
      const indexRegion = this.ccbRegions.map(c=>c.id).indexOf(this.itinerario.ccbRegion);
      const nombreRegion = this.ccbRegions[indexRegion].nombre;
      this.itinerario.lugar = `CCB - ${nombreRegion}`
    }
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

  setLugar() {
    if (this.ccb) {
      this.itinerario.lugar = 'CCB';
    } else {
      this.itinerario.lugar = '';
      this.itinerario.ccbRegion = null;
    }
  }
}
