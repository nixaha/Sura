import { Component, Input } from '@angular/core';
import { NavController, NavParams, Button } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Evento } from '../../../shared/models/evento.model';
import { UserInfo } from '../../../shared/models/user-info';
import { EventosComPage } from "../../index.paginas"
import { map } from 'rxjs/operators';
import { AlertController } from 'ionic-angular';

import { MessagesService, AdminService, LoginService } from '../../../services/index.services';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { text } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'page-eventos',
  templateUrl: 'eventos.html',
})
export class EventosPage {

  // private noticiasCollection: AngularFirestoreCollection<Evento>;

  // eventos: Observable<Evento[]>;
  // notiDoc: AngularFirestoreDocument<Evento[]>;
  // eventocom: any = EventosComPage;

  // nombre: string = '';
  // introduccion: string = '';
  // imagen: string = '';

  public evento = {} as Evento;
  public eventos: Array<Evento>;
  public userInfo: UserInfo;
  public clave: string;
  
  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private messagesService: MessagesService,
    private adminService: AdminService,
    private loginService: LoginService
  ) {
    this.cargarEventos();
    this.cargarUserInfo();

    // this.noticiasCollection = database.collection<Evento>("eventos");
    // this.eventos = this.noticiasCollection.snapshotChanges().pipe(
    //   map(actions => actions.map(action => {
    //     const data = action.payload.doc.data() as Evento;
    //     const id = action.payload.doc.id;
    //     return { id, ...data };
    //   }))
    // );

    // this.nombre = this.navParams.get('nombre');
    // this.introduccion = this.navParams.get('introduccion');
    // this.imagen = this.navParams.get('foto');

    // if (this.nombre != null) {
    //   const id = this.database.createId();
    //   const evento: Evento = { 'nombre': this.nombre, 'introduccion': this.introduccion, 'imagen': '' };
    //   this.noticiasCollection.doc(id).set(evento);
    //   this.navCtrl.push(EventosComPage, {
    //     id: evento
    //   });
    // }

  }

  cargarEventos() {
    this.eventos = [];
    this.messagesService.showLoadingMessage('Cargando Eventos...');
    this.adminService.getEventos().then(
      result => {
        result.forEach(doc => {
          this.eventos.push(doc.data());
        });
        this.messagesService.hideLoadingMessage();
      },
      error => {
        this.messagesService.hideLoadingMessage();
        this.messagesService.showMessage('Error', 'Error al Cargar los Eventos', ['Aceptar']);
      }
    );
  }

  cargarUserInfo() {
    const data = localStorage.getItem('data');
    if (data) {
      this.userInfo = JSON.parse(data)
    }
  }

  showPrompt(index) {
    if (!this.registrado(index)) {
      const prompt = this.alertCtrl.create({
        title: 'Ingrese la Clave para Registrarse',
        //message: "para registrarse",
        inputs: [
          {
            name: 'Clave',
            placeholder: 'Clave',
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
              this.clave = data.clave;
              this.registrarEvento(index);
            }
          }
        ]
      });
      prompt.present();
    } else {
      this.navCtrl.push(EventosComPage,{eventoId:this.eventos[index].id});
    }
  }
 
  registrado(index) {
    const eventoId = this.eventos[index].id;
    const eventosRegistrados = this.userInfo.eventosRegistrados;
    if (this.userInfo && eventosRegistrados) {
      const registrado = eventosRegistrados.indexOf(eventoId);
      if (registrado !== -1) {
        return true;
      }
    } else {
      return false;
    }
  }

  registrarEvento(index) {
    this.verificarClave(index);
  }

  verificarClave(index) {
    const clave = this.eventos[index].clave;
    if (clave !== this.clave) {
      this.messagesService.showMessage('Error', 'Clave Incorrecta', ['Aceptar'])
    } else {
      if (!this.userInfo.eventosRegistrados) {
        this.userInfo.eventosRegistrados = [];
      }
      this.userInfo.eventosRegistrados.push(this.eventos[index].id);
      this.loginService.setUserInfo(this.userInfo);
      localStorage.setItem('data', JSON.stringify(this.userInfo));
      localStorage.removeItem('lastRegister');
      this.navCtrl.push(EventosComPage,{eventoId:this.eventos[index].id});
    }
  }

  //detalles(_evento: Evento){
  //this.navCtrl.push(EventosComPage, {
  // id: _evento
  //})
  //}

}

