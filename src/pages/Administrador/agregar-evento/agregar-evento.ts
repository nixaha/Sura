import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

import { ImagePicker } from '@ionic-native/image-picker/ngx';

import { OpcionesPage } from "../opciones/opciones";

import {
  AdminService,
  MessagesService
} from "../../../services/index.services";

import { Evento } from "../../../shared/models/evento.model";
import { eventoImgConfig } from '../../../shared/consts/image.consts';

@Component({
  selector: "page-agregar-evento",
  templateUrl: "agregar-evento.html"
})
export class AgregarEventoPage {
  public evento = {} as Evento;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminService: AdminService,
    private messagesService: MessagesService,
    private imagePicker: ImagePicker
  ) { }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AgregarEventoPage");
  }

  guardar() {
    this.messagesService.showLoadingMessage("Registrando evento...");
    this.adminService.createEvento(this.evento).then(
      result => {
        console.log("guardado");
        this.messagesService.hideLoadingMessage();
        this.navCtrl.setRoot(OpcionesPage);
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

  cargarImagen() {
    this.imagePicker.hasReadPermission().then(
      result => {
        if (!result) {
          this.imagePicker.requestReadPermission();
        } else {
          this.imagePicker.getPictures(eventoImgConfig).then(
            result => {
              for (var i = 0; i < result.length; i++) {
                this.guardarImagen(result[i])
                console.log('Image URI: ' + result[i]);
              }
            }, error => {
              console.log(error);
            });
        }
      }, error => {
        console.log(error);
      }
    );
  }

  guardarImagen(imagen){
    this.adminService.uploadImage(imagen).then(
      result=>{
        console.log(result);
      },error=>{
        console.log(error);
      }
    );
  }
}
