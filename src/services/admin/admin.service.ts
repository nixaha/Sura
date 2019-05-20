import { Injectable } from "@angular/core";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "@angular/fire/firestore";

import { Evento } from "../../shared/models/evento.model";
import { Itinerario } from "../../shared/models/itinerario.model";

import { strings } from "../../shared/consts/strings.const";

@Injectable()
export class AdminService {
  private collectionEventos = "eventos";
  private collectionItinerarios = "";

  constructor(
    private angfireAuth: AngularFireAuth,
    private angfirestore: AngularFirestore
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

  getItinerarios(): Promise<any> {
    return this.angfirestore
      .collection(this.collectionItinerarios) //.where('evento','==',true)
      .get()
      .toPromise();
  }

  createUpdateItinerario(itinerario: Itinerario) {
    return this.angfirestore
      .collection(this.collectionItinerarios)
      .doc(itinerario.nombre)
      .set(Object.assign({}, itinerario));
  }

  deleteItinerario(itinerario: Itinerario) {
    return this.angfirestore
      .collection(this.collectionItinerarios)
      .doc(itinerario.nombre)
      .delete();
  }

  getErrorEventoMessage(code): string {
    return strings.registroEventoErrors.defaultregistroEvtMsg;
  }

  getErrorItinerarioMessage(code): string {
    return strings.registroItinerarioErrors.defaultregistroItiMsg;
  }
}
