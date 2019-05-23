import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { Camera, CameraOptions } from "@ionic-native/camera";

import { EventosAdminPage } from "../eventos/eventos";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";
import { Evento } from "../../../shared/models/evento.model";

@Component({
  selector: "page-editar-evento",
  templateUrl: "editar-evento.html"
})
export class EditarEventoPage {
  public evento = {} as Evento;
  public image: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.evento = navParams.get("evento");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EditarEventoPage");
  }

  cargarImagen() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    };
    this.camera.getPicture(options).then(
      result => {
        this.image = result;
      },
      error => {
        this.messagesService.showToastMessage("Seleccione una imagen");
      }
    );
  }

  guardarImagen() {
    this.adminService.uploadImage(this.image, this.evento.imagenId).then(
      result => {
        this.buscarImgUrl();
      },
      error => {
        this.messagesService.showMessage("Error", "No se pudo guardar imagen", [
          "Aceptar"
        ]);
      }
    );
  }

  buscarImgUrl() {
    this.getImagenUrl();
  }

  getImagenUrl() {
    this.adminService.getImageUrl(this.evento.imagenId).then(
      result => {
        this.evento.imagenUrl = result;
        this.editar();
      },
      error => {
        this.messagesService.showMessage("Error", "No se pudo guardar imagen", [
          "Aceptar"
        ]);
      }
    );
  }

  editar() {
    this.messagesService.showLoadingMessage("Actualizando evento...");
    this.adminService.updateEvento(this.evento).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showToastMessage("Evento actualizado");
        this.navCtrl.setRoot(EventosAdminPage);
      },
      error => {
        this.messagesService.showMessage(
          "Error",
          this.adminService.getErrorEventoMessage(error.code),
          ["Aceptar"]
        );
        console.log(error);
      }
    );
  }
}
