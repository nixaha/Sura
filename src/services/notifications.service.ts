import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';

import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { AngularFirestore } from "angularfire2/firestore";
import { LoginService, MessagesService } from './index.services';

@Injectable()
export class NotificationsService {

  constructor(
    private push: Push,
    private angfireStore: AngularFirestore,
    private loginService: LoginService,
    private messageService: MessagesService
  ) { }

  pushSetup() {
    const options: PushOptions = {
      android: {
        senderID: environment.firebaseConfig.messagingSenderId
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    }
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => { console.log('Received a notification', notification) });
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration)
      const token = registration.registrationId;
      const devicesRef = this.angfireStore.collection('devices');
      const docData = {
        token,
        userId: this.loginService.getUserId()
      }
      return devicesRef.doc(token).set(docData);
    });
    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
      this.messageService.showMessage('Error', JSON.stringify(error), []);
    });
  }

}
