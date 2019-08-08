import { Injectable } from "@angular/core";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import { Evento } from "../../shared/models/evento.model";
import { Itinerario } from "../../shared/models/itinerario.model";

import { strings } from "../../shared/consts/strings.const";
import { UploadTask } from "@angular/fire/storage/interfaces";
/*Galeria*/ 
import { Galeria } from "../../commons/galeria";

@Injectable()
export class AdminService {
  private collectionEventos = "eventos";
  private collectionimagenes = "galerias";
  private collectionItinerarios = "itinerarios";
  private storageEventos = "eventos";

  constructor(
    private angfireAuth: AngularFireAuth,
    private angfirestore: AngularFirestore,
    private angfireStorage: AngularFireStorage
  ) {}

  getEventos(): Promise<any> {
    return this.angfirestore
      .collection(this.collectionEventos)
      .ref.orderBy("fechaInicio") //.get()
      .get();
    //.toPromise();
  }

  getImagen(): Promise<any> {
    return this.angfirestore
      .collection(this.collectionimagenes)
      .ref.orderBy("fechaInicio") //.get()
      .get();
    //.toPromise();
  }
  generateId(): string {
    return this.angfirestore.createId();
  }
  generateIdImagen(): string {
    return this.angfirestore.createId();
  }


  createEvento(evento: Evento): Promise<any> {
    const id = this.generateId();
    evento.id = id;
    return this.angfirestore
      .collection(this.collectionEventos)
      .doc(id)
      .set(evento);
  }

  creategaleria(galeria: Galeria): Promise<any> {
    const id = this.generateId();
    galeria.id = id;
    return this.angfirestore
      .collection(this.collectionimagenes)
      .doc(id)
      .set(galeria);
  }

  updateEvento(evento: Evento): Promise<any> {
    return this.angfirestore
      .collection(this.collectionEventos)
      .doc(evento.id)
      .set(evento);
  }
  updateGaleria(evento: Galeria): Promise<any> {
    return this.angfirestore
      .collection(this.collectionimagenes)
      .doc(evento.id)
      .set(evento);
  }

  deleteEvento(evento: Evento): Promise<any> {
    return this.angfirestore
      .collection(this.collectionEventos)
      .doc(evento.id)
      .delete();
  }
  
  deleteGaleria(evento: Galeria): Promise<any> {
    return this.angfirestore
      .collection(this.collectionimagenes)
      .doc(evento.id)
      .delete();
  }

  uploadImage(image, id): UploadTask {
    const imgString = `data:image/jpeg;base64,${image}`;
    return this.angfireStorage
      .ref(`${this.storageEventos}/${id}`)
      .putString(imgString, "data_url").task;
  }

  
  uploadGaleria(image, id): UploadTask {
    const imgString = `data:image/jpeg;base64,${image}`;
    return this.angfireStorage
      .ref(`${this.storageEventos}/${id}`)
      .putString(imgString, "data_url").task;
  }

  getImageUrl(id): Promise<any> {
    return this.angfireStorage
      .ref(`${this.storageEventos}/${id}`)
      .getDownloadURL()
      .toPromise();
  }
  getImageUrlGaleria(id): Promise<any> {
    return this.angfireStorage
      .ref(`${this.storageEventos}/${id}`)
      .getDownloadURL()
      .toPromise();
  }

  deleteImage(id): Promise<any> {
    return this.angfireStorage
      .ref(`${this.storageEventos}/${id}`)
      .delete()
      .toPromise();
  }
  deleteImageGaleria(id): Promise<any> {
    return this.angfireStorage
      .ref(`${this.storageEventos}/${id}`)
      .delete()
      .toPromise();
  }
///////////////////////////Itinerariossssssssssssssssssssssss
  getItinerarios(eventoId): Promise<any> {
    return (
      this.angfirestore
        .collection(this.collectionItinerarios)
        .ref.where("eventoId", "==", eventoId)
        //.orderBy("fecha")
        .get()
    );
  }

  createItinerario(itinerario: Itinerario) {
    const id = this.generateId();
    itinerario.id = id;
    return this.angfirestore
      .collection(this.collectionItinerarios)
      .doc(id)
      .set(itinerario);
  }

  updateItinerario(itinerario: Itinerario): Promise<any> {
    return this.angfirestore
      .collection(this.collectionItinerarios)
      .doc(itinerario.id)
      .set(itinerario);
  }

  deleteItinerario(itinerario: Itinerario) {
    return this.angfirestore
      .collection(this.collectionItinerarios)
      .doc(itinerario.id)
      .delete();
  }

  getErrorEventoMessage(code): string {
    return strings.registroEventoErrors.defaultregistroEvtMsg;
  }

  getErrorItinerarioMessage(code): string {
    return strings.registroItinerarioErrors.defaultregistroItiMsg;
  }

  /*GALERIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA*/


}
