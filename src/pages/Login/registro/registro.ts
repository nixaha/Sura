import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../../shared/models/user';
import { UserInfo } from '../../../shared/models/user-info';
import { TabsPage } from "../../index.paginas"

import { LoginService, MessagesService, NotificationsService } from '../../../services/index.services';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  user = {} as User;

  userInfo: UserInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginService: LoginService,
    private messagesService: MessagesService,
    private notificationService: NotificationsService
  ) {
    this.userInfo = new UserInfo();
  }

  ionViewDidLoad() {
    //this.getInfoUsuario();
  }

  saveInfoUsuario(token){
    this.loginService.getUserInfo().on("value",(snapshot)=>{
      console.log(snapshot.val())
      const data = {
        token: token,
        nombre: snapshot.child("nombre").val(),
        estado: snapshot.child("estado").val(),
        rol: snapshot.child("rol").val(),
        eventosRegistrados: snapshot.child("eventosRegistrados").val()
      };
      localStorage.setItem("data", JSON.stringify(data));
    });
  }
  
  register() {
    if (this.user.password === this.user.password2) {
      this.messagesService.showLoadingMessage('Registrando usuario...');
      this.loginService.register(this.user).then(
        response => {
          this.loginService.setUserInfo(this.userInfo);
          this.saveInfoUsuario(response.user.refreshToken);
          this.notificationService.setNotificationRegistry();
          this.navCtrl.setRoot(TabsPage);
          this.messagesService.hideLoadingMessage();
        }, error => {
          console.log(error)
          this.messagesService.showMessage('Error',this.loginService.getRegUsrErrorMessage(error.code,this.user.email),['Aceptar']);
          this.messagesService.hideLoadingMessage();
        }
      );
    }
  }

}
