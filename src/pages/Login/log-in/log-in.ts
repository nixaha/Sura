import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegistroPage, RestablecerContraPage, TabsPage, OpcionesPage } from "../../index.paginas"
import { User } from "../../../shared/models/user";

import { LoginService, MessagesService } from '../../../services/index.services';

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html',
})
export class LogInPage {

  registro: any = RegistroPage;
  olvidar: any = RestablecerContraPage;
  
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
    console.log('ionViewDidLoad LogInPage');
  }

  login(){
   this.messagesService.showLoadingMessage('Autenticando...');
    this.loginService.login(this.user).then(
      result=>{
        this.loginService.getUserInfo().on('value',(snapshot)=>{
          const rol = snapshot.child('rol').val();
          if(rol === 'PARTICIPANTE'){
            this.navCtrl.setRoot(TabsPage);
          }else if (rol === 'ADMIN'){
            this.navCtrl.setRoot(OpcionesPage);
          }
        });
        this.messagesService.hideLoadingMessage();
      },error=>{
        console.log(JSON.stringify(error));
        this.messagesService.showMessage('Error', this.loginService.getLoginErrorMessage(error.code),['Aceptar']);
        this.messagesService.hideLoadingMessage();
      }
    );
  }

}
