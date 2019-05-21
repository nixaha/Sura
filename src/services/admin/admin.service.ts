import { Injectable } from "@angular/core";

import { AngularFireAuth } from "angularfire2/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import { Evento } from "../../shared/models/evento.model";
import { Itinerario } from "../../shared/models/itinerario.model";

import { strings } from "../../shared/consts/strings.const";
import { UploadTask } from "@angular/fire/storage/interfaces";
import { eventoImgConfig } from "../../shared/consts/image.consts";

@Injectable()
export class AdminService {
  private collectionEventos = "eventos";
  private collectionItinerarios = "itinerarios";
  private storageEventos = "eventos";

  constructor(
    private angfireAuth: AngularFireAuth,
    private angfirestore: AngularFirestore,
    private angfirestoreCollection: AngularFirestore,
    private angfireStorage: AngularFireStorage
  ) {}

  getEventos(): Promise<any> {
    return this.angfirestore
      .collection(this.collectionEventos)
      .get()
      .toPromise();
  }

  createEvento(evento: Evento): Promise<any> {
    const id = this.angfirestore.createId();
    evento.id = id;
    return this.angfirestore
      .collection(this.collectionEventos)
      .doc(id)
      .set(evento);
  }

  updateEvento(evento: Evento): Promise<any> {
    return this.angfirestore
      .collection(this.collectionEventos)
      .doc(evento.id)
      .set(evento);
  }

  deleteEvento(evento: Evento): Promise<any> {
    return this.angfirestore
      .collection(this.collectionEventos)
      .doc(evento.id)
      .delete();
  }

  uploadImage(image): UploadTask {
    const imgString = `data:image/jpeg;base64,${image}`;
    return this.angfireStorage
      .ref(this.storageEventos)
      .putString(imgString, "data_url").task;
  }

  getItinerarios(eventoId): Promise<any> {
    return this.angfirestoreCollection
      .collection(this.collectionItinerarios)
      .ref.where("eventoId", "==", eventoId)
      .get();
  }

  createItinerario(itinerario: Itinerario) {
    const id = this.angfirestore.createId();
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
}
