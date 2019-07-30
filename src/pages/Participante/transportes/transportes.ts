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

  transporte: Observable<Transporte[]>;
  notiDoc: AngularFirestoreDocument<Transporte[]>;
  transportelist:any = TransporteListPage;

  nombre: string = '';
  imagen: string = '';
  android: string ='';
  ios: string = '';
  
  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Transporte>("transportacion");
      
      this.transporte = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Transporte;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );
      this.nombre = this.navParams.get('nombre');
      this.imagen = this.navParams.get('imagen');
      
      this.android = this.navParams.get('android');
      this.ios = this.navParams.get('ios');
    
      if(this.nombre != null) {
        const id = this.database.createId(); 
        const transporte: Transporte = { 'nombre':this.nombre, 'imagen': this.imagen, 'android': this.android, 'ios': this.ios};
        this.noticiasCollection.doc(id).set(transporte); 
        this.navCtrl.push(TransporteListPage, {
          id: transporte
        });    
     }  
  }
  detalles(_transporte: Transporte){
    this.navCtrl.push(TransporteListPage, {
      id: _transporte
    })
  }
}
