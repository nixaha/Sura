import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from "@ionic-native/camera";
import { MessagesService, AdminService } from '../../../services/index.services';



import { Galeria } from "../../../commons/galeria";
@Component({
  selector: 'page-eliminar-evento',
  templateUrl: 'eliminar-evento.html',
})
export class EliminarEventoPage {
  public image: string;
  public galerias = {} as Galeria;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private messagesService: MessagesService, private camera: Camera,
    
    private adminService: AdminService
    ) {
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EliminarEventoPage');
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
        //this.getImagenUrl();
        this.messagesService.hideLoadingMessage();
      },
      error => {
        this.messagesService.showToastMessage("Seleccione una imagen");
        this.messagesService.hideLoadingMessage();
      }
    );
  }

  guardarImagen() {
    this.galerias.imagenId = this.adminService.generateId();
    this.adminService.uploadGaleria(this.image, this.galerias.imagenId).then(
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
    this.messagesService.showLoadingMessage("Registrando...");
    this.getImagenUrl();
  }

  
  getImagenUrl() {
    this.adminService.getImageUrlGaleria(this.galerias.imagenId).then(
      result => {
        this.galerias.imagenUrl = result;
        this.creategaleria();
      },
      error => {
        this.messagesService.showMessage("Error", "No se pudo guardar imagen", [
          "Aceptar"
        ]);
        this.messagesService.hideLoadingMessage();
      }
    );
  }
  
  creategaleria() {
    console.log(this.galerias)
    this.adminService.creategaleria(this.galerias).then(
      result => {
        this.messagesService.hideLoadingMessage();
        this.navCtrl.pop();
        this.messagesService.showToastMessage("Imagen guardada exitosamente");
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
}
