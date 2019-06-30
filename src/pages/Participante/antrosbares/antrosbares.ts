import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Antro } from '../../../commons/antros';
import{ AntrosListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';

@Component({
  selector: 'antros-bares',
  templateUrl: 'antrosbares.html',  
})

export class AntrosBaresPage {
  private noticiasCollection: AngularFirestoreCollection<Antro>;

  antro: Observable<Antro[]>;
  notiDoc: AngularFirestoreDocument<Antro[]>;
  restaurantelist:any = AntrosListPage;

  nombre: string ='';
  introduccion: string='';
  horarios: string ='';
  direccion: string ='';
  telefono: string ='';
  imagen: string ='';
  costo: string='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Antro>("restaurantes");
      
      this.antro = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Antro;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.introduccion = this.navParams.get('introduccion');
      this.horarios = this.navParams.get('horarios'); 
      this.direccion = this.navParams.get('direccion');
      this.telefono = this.navParams.get('telefono');
      this.imagen = this.navParams.get('imagen');
      this.costo = this.navParams.get('costo');
      console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const antross: Antro = { 'nombre':this.nombre, 'introduccion':this.introduccion, 'horarios':this.horarios, 'direccion':this.direccion, 'telefono':this.telefono, 'imagen':this.imagen, 'costo':this.costo};
        this.noticiasCollection.doc(id).set(antross); 
        this.navCtrl.push(AntrosListPage, {
          id: antross
        });    
    }
        
  }

  detalles(_antro: Antro){
    this.navCtrl.push(AntrosListPage, {
      id: _antro
    })
  }

}
