import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';  
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Aerolineasm } from '../../../commons/aerolineas';
import { map } from 'rxjs/operators';

@Component({
 selector: 'aerolineas',
    templateUrl: 'aerolineas.html',                   
})
export class Aerolineas {
  
  private noticiasCollection: AngularFirestoreCollection<Aerolineasm>;
  
  vuelos: Observable<Aerolineasm[]>;
  notiDoc: AngularFirestoreDocument<Aerolineasm[]>;
   

  aerolinea: string ='';
  frecuencia: string='';
  horario: string ='';
  destino: string =''; 

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {

      this.noticiasCollection = database.collection<Aerolineasm>("vuelos");
      
      this.vuelos = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Aerolineasm;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.aerolinea = this.navParams.get('aerolinea');
      this.destino = this.navParams.get('destino');
      this.frecuencia = this.navParams.get('frecuencia'); 
      this.horario = this.navParams.get('horario'); 

    if(this.aerolinea != null) {
        const id = this.database.createId(); 
        const vuelo: Aerolineasm = { 'aerolinea':this.aerolinea, 'destino':this.destino, 'frecuencia':this.frecuencia, 'horario':this.horario};
        this.noticiasCollection.doc(id).set(vuelo); 
        // this.navCtrl.push(HotelesListPage, {
        //   id: hotel
        // });    
    }
        
  }
  // detalles(_hotel: Hotel){
  //   this.navCtrl.push(HotelesListPage, {
  //     id: _hotel
  //   })
  // }
//   buscar( event ){
//     //const texto = event._value;
//     //this.textoBuscar = event.detail(data.value);
//     console.log(event);    
// }
}