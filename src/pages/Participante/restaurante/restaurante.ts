import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Restaurante } from '../../../commons/restaurante';
import{ RestauranteListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';

@Component({
  selector: 'page-restaurante',
  templateUrl: 'restaurante.html',
})
export class RestaurantePage {
  private noticiasCollection: AngularFirestoreCollection<Restaurante>;

  restaurantes: Observable<Restaurante[]>;
  notiDoc: AngularFirestoreDocument<Restaurante[]>;
  restaurantelist:any = RestauranteListPage;

  nombre: string ='';
  introduccion: string='';
  horarios: string ='';
  direccion: string ='';
  telefono: string ='';
  imagen: string ='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Restaurante>("restaurantes");
      
      this.restaurantes = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Restaurante;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.introduccion = this.navParams.get('introduccion');
      this.horarios = this.navParams.get('horarios'); 
      this.direccion = this.navParams.get('direccion');
      this.telefono = this.navParams.get('telefono');
      this.imagen = this.navParams.get('foto');
      console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const restaurante: Restaurante = { 'nombre':this.nombre, 'introduccion':this.introduccion, 'horarios':this.horarios, 'direccion':this.direccion, 'telefono':this.telefono, 'imagen':''};
        this.noticiasCollection.doc(id).set(restaurante); 
        this.navCtrl.push(RestauranteListPage, {
          id: restaurante
        });    
    }
        
  }

  detalles(_restaurante: Restaurante){
    this.navCtrl.push(RestauranteListPage, {
      id: _restaurante
    })
  }

}
