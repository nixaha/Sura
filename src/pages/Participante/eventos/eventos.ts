import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Evento } from '../../../shared/models/evento.model';
import { UserInfo } from '../../../shared/models/user-info';
import { EventosComPage } from "../../index.paginas"
import { AlertController } from 'ionic-angular';

import { MessagesService, AdminService, LoginService } from '../../../services/index.services';
import { LogInPage } from '../../Login/log-in/log-in';
import { OpcionesPage } from '../../index.paginas';

@Component({
  selector: 'page-eventos',
  templateUrl: 'eventos.html',
})
export class EventosPage {

  public evento = {} as Evento;
  public eventos: Array<Evento>;
  public userInfo: UserInfo;
  public clave: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private messagesService: MessagesService,
    private adminService: AdminService,
    private loginService: LoginService
  ) {
    this.checkSession();
    // this.cargarUserInfo();
    // this.cargarEventos();
  }

  //iOS
  checkSession() {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      this.checkRole(data.rol);
    } else {
      this.navCtrl.push(LogInPage);
    }
  }

  checkRole(rol) {
    if (rol === "PARTICIPANTE") {
      this.cargarUserInfo();
      this.cargarEventos();
    } else if (rol === "ADMIN") {
      this.navCtrl.push(OpcionesPage)
    }
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
        title: 'Ingresar clave y datos adicionales',
        message: '*Por tu seguridad en el destino proporciona los siguientes datos',
        inputs: [
          {
            name: 'clave',
            placeholder: 'Clave',
          },
          {
            name: 'tipoSangre',
            placeholder: 'Tipo de sangre'
          },
          {
            name: 'alergias',
            placeholder: 'Alergias (alimento y/o medicamento)'
          }
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
              this.userInfo.tipoSangre = data.tipoSangre;
              this.userInfo.alergias = data.alergias;
              this.registrarEvento(index);
              console.log(this.userInfo)
            }
          }
        ]
      });
      prompt.present();
    } else {
      this.navCtrl.push(EventosComPage, { eventoId: this.eventos[index].id });
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
      this.navCtrl.push(EventosComPage, { eventoId: this.eventos[index].id });
    }
  }
}

