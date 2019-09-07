import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Souvenir } from '../../../commons/souvenir';
import{ SouveListPage } from "../../index.paginas"
import { map } from 'rxjs/operators';

import { MessagesService } from '../../../services/index.services';

@Component({
  selector: 'page-souve',
  templateUrl: 'souve.html',
})
export class SouvePage {
  private noticiasCollection: AngularFirestoreCollection<Souvenir>;

  souvenirs: Observable<Souvenir[]>;
  notiDoc: AngularFirestoreDocument<Souvenir[]>;
  souvelist:any = SouveListPage;

  nombre: string ='';
  introduccion: string='';
  horarios: string ='';
  direccion: string ='';
  telefono: string ='';
  foto: string ='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    private messagesService: MessagesService,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Souvenir>("souvenirs");
      
      this.souvenirs = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Souvenir;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

     this.souvenirs.subscribe(
      result => {
        this.messagesService.hideLoadingMessage();
      }
    )

      this.nombre = this.navParams.get('nombre');
      this.introduccion = this.navParams.get('introduccion');
      this.horarios = this.navParams.get('horarios'); 
      this.direccion = this.navParams.get('direccion');
      this.telefono = this.navParams.get('telefono');
      this.foto = this.navParams.get('foto');
      //console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const souvenirs: Souvenir = { 'nombre':this.nombre, 'introduccion':this.introduccion, 'horarios':this.horarios, 'direccion':this.direccion, 'telefono':this.telefono, 'foto':this.foto};
        this.noticiasCollection.doc(id).set(souvenirs); 
        // this.navCtrl.push(SouveListPage, {
        //   id: souvenir
        // });    
    }
        
  }

  detalles(_souvenir: Souvenir){
    this.navCtrl.push(SouveListPage, {
      id: _souvenir
    })
  }

}

