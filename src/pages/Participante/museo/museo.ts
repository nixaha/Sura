import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Museo } from '../../../commons/museo';
import{ MuseoListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';

@Component({
  selector: 'page-museo',
  templateUrl: 'museo.html',
})
export class MuseoPage {
  private noticiasCollection: AngularFirestoreCollection<Museo>;

  museos: Observable<Museo[]>;
  notiDoc: AngularFirestoreDocument<Museo[]>;
  //notiCollectionRef: AngularFirestoreCollection<Museo[]>;
  museolist:any = MuseoListPage;

  nombre: string ='';
  descripcion: string='';
  horarios: string ='';
  costo: string ='';
  direccion: string ='';
  telefono: string ='';
  foto: string ='';


  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Museo>("museos");
      
      this.museos = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Museo;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.descripcion = this.navParams.get('descripcion');
      this.horarios = this.navParams.get('horarios');
      this.costo = this.navParams.get('costo');
      this.direccion = this.navParams.get('direccion');
      this.telefono = this.navParams.get('telefono');
      this.foto = this.navParams.get('foto');
      console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const museo: Museo = { 'nombre':this.nombre, 'descripcion':this.descripcion, 'horarios':this.horarios, 'costo':this.costo, 'direccion':this.direccion, 'telefono':this.telefono, 'foto':''};
        this.noticiasCollection.doc(id).set(museo); 
        this.navCtrl.push(MuseoListPage, {
          id: museo
        });    
    }
        
  }

  detalles(_museo: Museo){
    this.navCtrl.push(MuseoListPage, {
      id: _museo
    })
  }

}