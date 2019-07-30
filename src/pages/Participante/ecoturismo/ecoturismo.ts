import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Ecoturismo } from '../../../commons/ecoturismo';
import{ EcoturismoListPage } from "../../index.paginas";
import { map } from 'rxjs/operators';

@Component({
  selector: 'page-ecoturismo',
  templateUrl: 'ecoturismo.html',                   
})
export class EcoturismoPage {
 
  private noticiasCollection: AngularFirestoreCollection<Ecoturismo>;

  ecoturismo: Observable<Ecoturismo[]>;
  notiDoc: AngularFirestoreDocument<Ecoturismo[]>;
  //notiCollectionRef: AngularFirestoreCollection<Museo[]>;
  ecolist:any = EcoturismoListPage;

  nombre: string ='';
  ubicacion: string='';
  actividades: string ='';
  imagen: string ='';



  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Ecoturismo>("ecoturismo");
     // console.log(navParams+'museos llega a museo ts'+ this.noticiasCollection);
      this.ecoturismo = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Ecoturismo;
          const id = action.payload.doc.id;
          return { id, ...data };
        }),
               
        
        )
     );

      this.nombre = this.navParams.get('nombre');
      this.ubicacion = this.navParams.get('ubicacion');
      this.actividades = this.navParams.get('actividades');
      this.imagen = this.navParams.get('imagen');
     // console.log(this.navParams.get('foto'));

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const ecoturismo: Ecoturismo = { 'nombre':this.nombre, 
         'ubicacion':this.ubicacion, 'actividades':this.actividades, 'imagen':this.imagen};
        this.noticiasCollection.doc(id).set(ecoturismo);        
    }
        
  }

  detalles(_ecoturismo: Ecoturismo){
    this.navCtrl.push(EcoturismoListPage, {
      id: _ecoturismo
 
    })

  }
}