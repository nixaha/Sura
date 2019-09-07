import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Quema } from '../../../commons/quema';
import{ QmasvisitarListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';

import { MessagesService } from '../../../services/index.services'

@Component({
  selector: 'page-qmasvisitar',
  templateUrl: 'qmasvisitar.html',
})
export class QmasvisitarPage {

  private noticiasCollection: AngularFirestoreCollection<Quema>;

  quemas: Observable<Quema[]>;
  notiDoc: AngularFirestoreDocument<Quema[]>;
  qmasvisitarList:any = QmasvisitarListPage;

  nombre: string ='';
  introduccion: string='';
  horarios: string ='';
  direccion: string ='';
  telefono: string ='';
  costo: string ='';
  imagen: string ='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    private messagesService: MessagesService,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Quema>("quemas");
      
      this.quemas = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Quema;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

     this.quemas.subscribe(
      result => {
        this.messagesService.hideLoadingMessage();
      }
    )

      this.nombre = this.navParams.get('nombre');
      this.introduccion = this.navParams.get('introduccion');
      this.horarios = this.navParams.get('horarios'); 
      this.direccion = this.navParams.get('direccion');
      this.telefono = this.navParams.get('telefono');
      this.imagen = this.navParams.get('imagen');
      console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const quema: Quema = { 'nombre':this.nombre, 'introduccion':this.introduccion, 'horarios':this.horarios, 'direccion':this.direccion, 'telefono':this.telefono, 'costo':this.costo, 'imagen':''};
        this.noticiasCollection.doc(id).set(quema); 
        this.navCtrl.push(QmasvisitarListPage, {
          id: quema
        });    
    }
        
  }

  detalles(_quema: Quema){
    this.navCtrl.push(QmasvisitarListPage, {
      id: _quema
    })
  }

}
