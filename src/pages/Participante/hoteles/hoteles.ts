import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Hotel } from '../../../commons/hotel';
import{ HotelesListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';


@Component({
  selector: 'page-hoteles',
  templateUrl: 'hoteles.html',
})
export class HotelesPage {

  private noticiasCollection: AngularFirestoreCollection<Hotel>;

  hoteles: Observable<Hotel[]>;
  notiDoc: AngularFirestoreDocument<Hotel[]>;
  hotellist:any = HotelesListPage;

  nombre: string ='';
  descripcion: string='';
  categoria: string ='';
  direccion: string ='';
  telefono: string ='';
  imagen: string ='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Hotel>("hoteles");
      
      this.hoteles = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Hotel;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.descripcion = this.navParams.get('descripcion');
      this.categoria = this.navParams.get('categoria'); 
      this.direccion = this.navParams.get('direccion');
      this.telefono = this.navParams.get('telefono');
      this.imagen = this.navParams.get('foto');
      console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const hotel: Hotel = { 'nombre':this.nombre, 'descripcion':this.descripcion, 'categoria':this.categoria, 'direccion':this.direccion, 'telefono':this.telefono, 'imagen':''};
        this.noticiasCollection.doc(id).set(hotel); 
        this.navCtrl.push(HotelesListPage, {
          id: hotel
        });    
    }
        
  }

  detalles(_hotel: Hotel){
    this.navCtrl.push(HotelesListPage, {
      id: _hotel
    })
  }

}
