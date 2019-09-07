import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Galeria } from '../../../commons/galeria';
import{ GaleriaListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';
import { AlertController } from 'ionic-angular';

import { MessagesService } from '../../../services/index.services'

@Component({
  selector: 'page-galeria',
  templateUrl: 'galeria.html',
})
export class GaleriaPage {

  private noticiasCollection: AngularFirestoreCollection<Galeria>;

  galerias: Observable<Galeria[]>;
  notiDoc: AngularFirestoreDocument<Galeria[]>;
  galerialist:any = GaleriaListPage;

  nombre: string ='';
  id: string ='';
  descripcion: string ='';
  imagenId: string = '';
  imagenUrl: string = '';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams,
    private messagesService: MessagesService,
    public alertCtrl: AlertController) {

      this.messagesService.showLoadingMessage('Cargando información...');

      this.noticiasCollection = database.collection<Galeria>("galerias");
      
      this.galerias = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Galeria;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.id = this.navParams.get('id');
      this.descripcion = this.navParams.get('descripcion');
      this.imagenId = this.navParams.get('imagenId');
      this.imagenUrl = this.navParams.get('imagenUrl');

      this.messagesService.hideLoadingMessage();

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const galerias: Galeria = { 'nombre':this.nombre, 'id':this.id, 'descripcion':this.descripcion, 'imagenId': this.imagenId, 'imagenUrl': this.imagenUrl};
        this.noticiasCollection.doc(id).set(galerias); 
        this.navCtrl.push(GaleriaListPage, {
          id: galerias
        });    
    }
        
  }
  detalles(_galeria: Galeria){
    this.navCtrl.push(GaleriaListPage, {
     id: _galeria
    })
  }

}


