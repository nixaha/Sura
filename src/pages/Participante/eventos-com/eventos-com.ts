import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Itinerario } from "../../../shared/models/itinerario.model";

import { strings } from '../../../shared/consts/strings.const'

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";
import { CentroCon } from '../ccb/ccb';

@Component({
  selector: 'page-eventos-com',
  templateUrl: 'eventos-com.html',
})
export class EventosComPage {

  public itinerarios: Array<Itinerario>;
  public filtro;
  public eventoId: string;

  private tipos = strings.registroItinerarioCatalogos.tipos;
  private tipo:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.eventoId = this.navParams.get('eventoId');
    this.tipo = 'TODOS';
  }

  ionViewWillEnter() {
    this.cargarItinerarios();
  }

  cargarItinerarios() {
    this.itinerarios = [];
    this.filtro = [];
    this.messagesService.showLoadingMessage("Cargando itinerarios...");
    this.adminService.getItinerarios(this.eventoId).then(
      result => {
        result.forEach(doc => {
          this.itinerarios.push(doc.data());
        });
        this.messagesService.hideLoadingMessage();
        this.ordenarItinerarios();
        this.filtro = this.itinerarios;
      },
      error => {
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorItinerarioMessage(error.code),
          ["Aceptar"]
        );
        this.messagesService.hideLoadingMessage();
      }
    );
  }

  ordenarItinerarios() {
    const totalIti = this.itinerarios.length;
    for (let i = 0; i < totalIti; i++) {
      for (let j = i + 1; j < totalIti; j++) {
        const fechai = `${this.itinerarios[i].fecha}:${this.itinerarios[i].horaInicio}`;
        const fechaj = `${this.itinerarios[j].fecha}:${this.itinerarios[j].horaInicio}`;
        if( fechaj < fechai){
          const tmp = this.itinerarios[i];
          this.itinerarios[i] = this.itinerarios[j];
          this.itinerarios[j] = tmp;
        }
      }
    }
  }

  filtrar() {
    if (this.tipo !== 'TODOS') {
      this.filtro = this.itinerarios.filter(t => t.tipo == this.tipo);
    } else {
      this.filtro = this.itinerarios;
    }
  }

  ccb(region){
    console.log(region)
    this.navCtrl.push(CentroCon,{ccbRegion:region})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventosComPage');
  }

}
