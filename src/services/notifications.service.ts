<<<<<<< HEAD
import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Platform } from "ionic-angular";
import { Firebase } from '@ionic-native/firebase/ngx';

import { LoginService } from './login.service';

@Injectable()
export class NotificationService {
    constructor(
        private angfirebase: Firebase,
        private angfireStore: AngularFirestore,
        private platform: Platform,
        private loginService: LoginService
    ) { }

    async getToken() {
        let token;

        if (this.platform.is('android')) {
            token = await this.angfirebase.getToken();
        }

        if (this.platform.is('ios')) {
            token = await this.angfirebase.getToken();
            const perm = await this.angfirebase.grantPermission();
        }

        return this.saveTokenToFirestore(token);
    }

    private saveTokenToFirestore(token) {
        if (!token) return;
        const devicesRef = this.angfireStore.collection('devices');
        const docData = {
            token,
            userId: this.loginService.getUserId()
        }
        return devicesRef.doc(token).set(docData);
    }

    listenToNotifications() {
        return this.angfirebase.onNotificationOpen();
    }
} 
=======
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
>>>>>>> 414e72be81bd15e8579dd64f9321c83bb94e8cce
