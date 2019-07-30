import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Galeria} from "../../../commons/galeria";
import { AdminService, MessagesService } from '../../../services/index.services';
import { AgregarEventoPage, EditarEventoPage,EliminarEventoPage } from '../../index.paginas';

@Component({
  selector: 'page-eliminar-iti',
  templateUrl: 'eliminar-iti.html',
})
export class EliminarItiPage {
  public galeria: Array<Galeria>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {}

  cargarEventos() {
    this.galeria = [];
    this.messagesService.showLoadingMessage("Cargando Galeria...");
    this.adminService.getImagen().then(
      result => {
        result.forEach(doc => {
          this.galeria.push(doc.data());
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
    // es para subir la iamgen
    this.navCtrl.push(EliminarEventoPage);
  }
  // editarevento(index) {
  //   this.navCtrl.push(EditarEventoPage, { galeria: this.galeria[index] });
  //   console.log(this.galeria[index]);
  // }

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
    this.adminService.deleteImage(this.galeria[index].imagenId).then(
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
    this.messagesService.showLoadingMessage("Eliminando Imagen...");
    this.adminService.deleteGaleria(this.galeria[index]).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showToastMessage("Imagen eliminada");
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

  // agregarItinerarios(index) {
  //   this.navCtrl.push(ItinerariosPage, {
  //     eventoId: this.galeria[index].id
  //    // fechaInicio: this.eventos[index].fechaInicio,
  //     //fechaFin: this.eventos[index].fechaFin
  //   });
  // }
}

