import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Transporte } from '../../../commons/transportes';
import { map } from 'rxjs/operators';
import { TransporteListPage } from "../../index.paginas";



@Component({
  selector: 'transportes',
  templateUrl: 'transportes.html',                   
})
export class TransportesPage {
  private noticiasCollection: AngularFirestoreCollection<Transporte>;

  restaurantes: Observable<Transporte[]>;
  notiDoc: AngularFirestoreDocument<Transporte[]>;
  restaurantelist:any = TransporteListPage;

  nombre: string = '';
  introduccion: string= '';
  imagen: string ='';
  
  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Transporte>("restaurantes");
      
      this.restaurantes = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Transporte;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.introduccion = this.navParams.get('introduccion');
      this.imagen = this.navParams.get('imagen');
      console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const restaurante: Transporte = { 'nombre':this.nombre, 'introduccion':this.introduccion, 'imagen': this.imagen};
        this.noticiasCollection.doc(id).set(restaurante); 
        this.navCtrl.push(TransporteListPage, {
          id: restaurante
        });    
    }
        
  }

  detalles(_restaurante: Transporte){
    this.navCtrl.push(TransporteListPage, {
      id: _restaurante
    })
  }

}
