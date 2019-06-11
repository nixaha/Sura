import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { Camera, CameraOptions } from "@ionic-native/camera";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

import { Evento } from "../../../shared/models/evento.model";

@Component({
  selector: "page-agregar-evento",
  templateUrl: "agregar-evento.html"
})
export class AgregarEventoPage {
  public evento = {} as Evento;
  public image: string;
  public fechaValido: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService,
    private camera: Camera
  ) {
    this.fechaValido = true;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AgregarEventoPage");
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
        this.messagesService.hideLoadingMessage();
      },
      error => {
        this.messagesService.showToastMessage("Seleccione una imagen");
        this.messagesService.hideLoadingMessage();
      }
    );
  }

  guardarImagen() {
    this.evento.imagenId = this.adminService.generateId();
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
    this.messagesService.showLoadingMessage("Registrando evento...");
    this.getImagenUrl();
  }

  getImagenUrl() {
    this.adminService.getImageUrl(this.evento.imagenId).then(
      result => {
        this.evento.imagenUrl = result;
        this.crearEvento();
      },
      error => {
        this.messagesService.showMessage("Error", "No se pudo guardar imagen", [
          "Aceptar"
        ]);
      }
    );
  }

  crearEvento() {
    this.adminService.createEvento(this.evento).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.navCtrl.pop();
        this.messagesService.showToastMessage("Evento registrado exitosamente");
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
