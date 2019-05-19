import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class MessagesService {

    private loader;

    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController
    ) { }

    showMessage(title, msg, buttons) {
        const alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: buttons
        });
        alert.present();
    }

    showToastMessage(msg) {
        const toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

    showLoadingMessage(msg) {
        this.loader = this.loadingCtrl.create({
            content: msg
        });
        this.loader.present();
    }

    hideLoadingMessage(){
        this.loader.dismiss();    
    }

}