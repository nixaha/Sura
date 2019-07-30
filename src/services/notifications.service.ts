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