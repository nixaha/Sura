import { Injectable } from "@angular/core";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable()
export class ParticipanteService {
  private collectionUbicaciones = "ubicaciones";

  constructor(
    private angfireAuth: AngularFireAuth,
    private angfirestore: AngularFirestore,
    private angfireStorage: AngularFireStorage
  ) {}

  getUbicaciones(): Promise<any> {
    return this.angfirestore.collection(this.collectionUbicaciones).ref.get();
  }
}
