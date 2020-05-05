import { Injectable } from '@angular/core';
import { Platform } from "ionic-angular";

import { environment } from '../environments/environment';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
//import {LocalNotifications} from '@ionic-native/local-notifications';
//import { LocalNotifications } from '@ionic-native/local-notifications';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { AngularFirestore } from "angularfire2/firestore";
import { LoginService, MessagesService } from './index.services';
import * as moment from 'moment';


@Injectable()
export class NotificationsService {
  private collectionItinerarios = "itinerarios";

  constructor(
    private platform: Platform,
    private push: Push,
    private localNotifications: LocalNotifications,
    private angfireStore: AngularFirestore,
    private loginService: LoginService,
    private messageService: MessagesService
  ) {
    this.platform.ready().then(() => {
      //pruebas
      // this.localNotifications.on('click', (notification) => {
      //   (console.log(notification);
      // })
    });
  }

  setNotificationRegistry() {
    const pushObject = this.pushSetup();
    pushObject.on('registration').subscribe((registration: any) => {
      const token = registration.registrationId;
      const devicesRef = this.angfireStore.collection('devices');
      const docData = {
        token,
        userId: this.loginService.getUserId()
      }
      return devicesRef.doc(this.loginService.getUserId()).set(docData);
    });
    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
      this.messageService.showMessage('Error', JSON.stringify(error), []);
    });
  }

  setPushNotification() {
    const pushObject = this.pushSetup();
    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        this.messageService.showMessage('TEST', 'Notification', []);
      } else {
        this.messageService.showMessage('TEST', 'Notification', []);
      }
    });
  }

  pushSetup(): PushObject {
    const options: PushOptions = {
      android: {
        senderID: environment.firebaseConfig.messagingSenderId
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      }
    }
    return this.push.init(options);
  }

  checkSchedule() {
    const now = new Date();
    const fecha = this.getFormatoFecha(now);

    // const lastRegister = localStorage.getItem('lastRegister');
    const data = localStorage.getItem('data');
    if (data) {
      const eventosRegistrados = JSON.parse(data).eventosRegistrados;
      if (eventosRegistrados) {
        eventosRegistrados.forEach(evt => {
          this.getItinerariosByDate(evt, fecha);
          // if (!lastRegister || fecha > lastRegister) {
          //   this.getItinerariosByDate(evt, fecha);
          // }
        });
      }
    }
  }

  async getItinerariosByDate(eventoId, fecha) {
    await this.angfireStore
      .collection(this.collectionItinerarios)
      .ref.where("eventoId", "==", eventoId)
      .where("fecha", "==", fecha)
      .get().then(
        result => {
          result.forEach(doc => {
            this.scheduleNotification(doc.data());

          });
          // localStorage.setItem('lastRegister', fecha)
        },
        error => {
          console.log(error);
        }
      )
  }

  // scheduleNotification(itinerario) {
  //   const date = new Date(`${itinerario.fecha}:${itinerario.horaInicio}`);
  //   const scheduledDate = new Date(date.getTime() - (10 * 60 * 1000));
  //   const now = new Date();
    
  //   if(scheduledDate >= now) {
  //     this.localNotifications.schedule({
  //       id: 1,
  //       title: 'Aviso',
  //       text: `El itinerario: ${itinerario.nombre} comenzará en diez minutos`,
  //       at: scheduledDate,
  //       data:{"id": 1, "nombre": `${itinerario.nombre}` , "fecha": `${itinerario.fecha}`, "horaInicio": `${itinerario.horaInicio}`}
  //     });
  //   }

  // }
  // scheduleNotification(itinerario) {
  //   this.localNotifications.schedule({
      
  //     id: 1, 
  //     title: 'Aviso',
  //     text: `El itinerario: ${itinerario.nombre} comenzará en 10 minutos`,
  //     trigger: { in: 10, unit: 'minute' },
  //     data:{"id": 1, "nombre": `${itinerario.nombre}` , "fecha": `${itinerario.fecha}`, "horaInicio": `${itinerario.horaInicio}`}
  //   })
  // }
  //notifica
  scheduleNotification(itinerario) {
    const horaNotificacion = moment(itinerario.fecha).subtract(10, 'minutes');
    const horaActual = moment();
    if (horaActual.isAfter(horaNotificacion)) return;

    this.localNotifications.schedule({
      id: 1, 
      title: 'Aviso',
      text: `El itinerario: ${itinerario.nombre} comenzará en 10 minutos`,
      trigger: { at: horaNotificacion.toDate() },
      data:{"id": 1, "nombre": `${itinerario.nombre}` , "fecha": `${itinerario.fecha}`, "horaInicio": `${itinerario.horaInicio}`}
    })
     
  }


  // scheduleNotification(itinerario) {
  //   const horaNotificacion = moment(fecha).subtract(10, 'minutes');
  //   const horaActual = moment();
  //   if (horaActual.isAfter(horaNotificacion)) return;

  //   this.localNotification.schedule({
  //     id: 1, // O un id generado,
  //     title: 'Aviso',
  //     text: `El itinerario: ${itinerario.nombre} comenzará en 10 minutos`,
  //     trigger: { at: horaNotificacion.toDate() },
  //     data: { id: 1, nombre: itinerario.nombre, fecha: itinerario.fecha, horaInicio: ... }
  //   })
  // }

  getFormatoFecha(date) {
    const dia = date.getUTCDate();
    const mes = date.getUTCMonth() + 1;
    const diaFormat = (dia < 10) ? `0${dia}` : `${dia}`;
    const mesFormat = (mes < 10) ? `0${mes}` : `${mes}`;
    return `${date.getFullYear()}-${mesFormat}-${diaFormat}`;
  }


}
