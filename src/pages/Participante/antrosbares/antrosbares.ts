import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Antro } from '../../../commons/antros';
import{ AntrosbaresListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';

@Component({
  selector: 'antros-bares',
  templateUrl: 'antrosbares.html',  
})

export class AntrosBaresPage {
  private noticiasCollection: AngularFirestoreCollection<Antro>;

  antrosbares: Observable<Antro[]>;
  notiDoc: AngularFirestoreDocument<Antro[]>;
  antrosbareslist:any = AntrosbaresListPage;

  nombre: string ='';
  introduccion: string='';
  horario: string ='';
  direccion: string ='';
  telefono: string ='';
  imagen: string ='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Antro>("antrosbares");
      
      this.antrosbares = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Antro;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.introduccion = this.navParams.get('introduccion');
      this.horario = this.navParams.get('horario'); 
      this.direccion = this.navParams.get('direccion');
      this.telefono = this.navParams.get('telefono');
      this.imagen = this.navParams.get('imagen');


    if(this.nombre != null) {
        const id = this.database.createId(); 
        const antrosbares: Antro = { 'nombre':this.nombre, 'introduccion':this.introduccion, 'horario':this.horario, 'direccion':this.direccion, 'telefono':this.telefono, 'imagen':this.imagen};
        this.noticiasCollection.doc(id).set(antrosbares); 
        // this.navCtrl.push(AntrosbaresListPage, {
        //   id: antro
        // });    
    }
        
  }

  detalles(_antrosbares: Antro){
    this.navCtrl.push(AntrosbaresListPage, {
      id: _antrosbares
    })
  }

}
