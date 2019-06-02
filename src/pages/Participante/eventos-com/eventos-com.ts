import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Itinerario } from "../../../shared/models/itinerario.model";

import { strings } from '../../../shared/consts/strings.const'

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

@Component({
  selector: 'page-eventos-com',
  templateUrl: 'eventos-com.html',
})
export class EventosComPage {

  public itinerarios: Array<Itinerario>;
  public filtro;
  public eventoId: string;

  private tipos = strings.registroItinerarioCatalogos.tipos;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.eventoId = this.navParams.get('eventoId');
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

  filtrar(tipo) {
    if(tipo !== 'TODOS'){
      this.filtro = this.itinerarios.filter(t => t.tipo == tipo);
    }else{
      this.filtro = this.itinerarios;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventosComPage');
  }

}
