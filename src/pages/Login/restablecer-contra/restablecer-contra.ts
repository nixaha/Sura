import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from "../../../shared/models/user";

import { LoginService, MessagesService } from '../../../services/index.services'
import { LogInPage } from '../log-in/log-in';

@Component({
  selector: 'page-restablecer-contra',
  templateUrl: 'restablecer-contra.html',
})
export class RestablecerContraPage {
  user = {} as User;
  email: string = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginService: LoginService,
    private messagesService: MessagesService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestablecerContraPage');
  }

  resetPassword() {
    this.loginService.resetPassword(this.user.email).then(
      response => {
        this.messagesService.showMessage('Enviado', 'Revise su correo para reestablecer su contraseña y vuelva a ingresar',
          [{
            text: 'Aceptar',
            handler: () => {
              localStorage.clear();
              this.navCtrl.setRoot(LogInPage);
            }
          }]);
      }, error => {
        this.messagesService.showMessage('Error', this.loginService.getLoginErrorMessage(error.code), ['Aceptar']);
      }
    );
  }

}
