import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Evento } from '../../../commons/evento';
import{ EventosComPage } from "../../index.paginas"
import { map } from 'rxjs/operators';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-eventos',
  templateUrl: 'eventos.html',
})
export class EventosPage {

  private noticiasCollection: AngularFirestoreCollection<Evento>;

  eventos: Observable<Evento[]>;
  notiDoc: AngularFirestoreDocument<Evento[]>;
  eventocom:any = EventosComPage;

  nombre: string ='';
  introduccion: string='';
  imagen: string ='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams,
    public alertCtrl: AlertController) {
      this.noticiasCollection = database.collection<Evento>("eventos");
      
      this.eventos = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Evento;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

      this.nombre = this.navParams.get('nombre');
      this.introduccion = this.navParams.get('introduccion');
      this.imagen = this.navParams.get('foto');
      console.log

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const evento: Evento = { 'nombre':this.nombre, 'introduccion':this.introduccion, 'imagen':''};
        this.noticiasCollection.doc(id).set(evento); 
        this.navCtrl.push(EventosComPage, {
          id: evento
        });    
    }
        
  }
 showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'Inserte la clabe',
      message: "para registrarse",
      inputs: [
        {
          name: 'clabe',
          placeholder: 'clabe'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  //detalles(_evento: Evento){
    //this.navCtrl.push(EventosComPage, {
     // id: _evento
    //})
  //}

}

