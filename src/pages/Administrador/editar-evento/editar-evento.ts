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
  public loadedImage: string;
  public fechaValido: boolean;
  public imageChange: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private adminService: AdminService,
    private messagesService: MessagesService
  ) {
    this.evento = navParams.get("evento");
    this.loadedImage = this.evento.imagenUrl;
    this.validarFechas();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EditarEventoPage");
  }

  cargarImagen() {
    this.messagesService.showLoadingMessage('Cargando imagen...');
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    };
    this.camera.getPicture(options).then(
      result => {
        this.image = result;
        this.loadedImage = `data:image/jpeg;base64,${this.image}`;
        this.imageChange = true;
        this.messagesService.hideLoadingMessage();
      },
      error => {
        this.messagesService.showToastMessage("Seleccione una imagen");
        this.messagesService.hideLoadingMessage();
      }
    );
  }

  guardarImagen() {
    if (this.imageChange) {
      this.adminService.uploadImage(this.image, this.evento.imagenId).then(
        result => {
          this.buscarImgUrl();
        },
        error => {
          this.messagesService.showMessage(
            "Error",
            "No se pudo guardar imagen",
            ["Aceptar"]
          );
        }
      );
    } else {
      this.editar();
    }
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

  validarFechas() {
    if (this.evento.fechaInicio && this.evento.fechaFin) {
      const fechaInicio = new Date(this.evento.fechaInicio);
      const fechaFin = new Date(this.evento.fechaFin);
      if (fechaInicio > fechaFin) {
        this.fechaValido = false;
      } else {
        this.fechaValido = true;
      }
    }
  }
}
