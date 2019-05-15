import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Galeria } from '../../../commons/galeria';
import{ GaleriaListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-galeria',
  templateUrl: 'galeria.html',
})
export class GaleriaPage {

  private noticiasCollection: AngularFirestoreCollection<Galeria>;

  galerias: Observable<Galeria[]>;
  notiDoc: AngularFirestoreDocument<Galeria[]>;
  galerialist:any = GaleriaListPage;

  nombre: string ='';
  imagen: string ='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams,
    public alertCtrl: AlertController) {
      this.noticiasCollection = database.collection<Galeria>("galerias");
      
      this.galerias = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Galeria;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.imagen = this.navParams.get('foto');
      console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const galeria: Galeria = { 'nombre':this.nombre, 'imagen':''};
        this.noticiasCollection.doc(id).set(galeria); 
        this.navCtrl.push(GaleriaListPage, {
          id: galeria
        });    
    }
        
  }
  detalles(_galeria: Galeria){
    this.navCtrl.push(GaleriaListPage, {
     id: _galeria
    })
  }

}


