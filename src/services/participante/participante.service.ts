import { Injectable } from "@angular/core";

import { AngularFirestore } from "@angular/fire/firestore";

@Injectable()
export class ParticipanteService {
  private collectionUbicaciones = "ubicaciones";
  private collectionCcbRegions = "ccbRegions";

  constructor(
    private angfirestore: AngularFirestore
  ) {}

  getUbicaciones(): Promise<any> {
    return this.angfirestore.collection(this.collectionUbicaciones).ref.get();
  }

  getCcbRegion(id): Promise<any> {
    return (
      this.angfirestore
      .collection(this.collectionCcbRegions)
      .ref.where('id','==',id)
      .get()
    );
  }
}
