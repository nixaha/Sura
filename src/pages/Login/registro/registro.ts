import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../../shared/models/user';
import { UserInfo } from '../../../shared/models/user-info';
import { TabsPage } from "../../index.paginas"
import { Page } from 'ionic-angular/umd/navigation/nav-util';

import { LoginService, MessagesService } from '../../../services/index.services';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  user = {} as User;

  userInfo: UserInfo;

  home: Page = TabsPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginService: LoginService,
    private messagesService: MessagesService
  ) {
    this.userInfo = new UserInfo();
  }

  ionViewDidLoad() {
    this.getInfoUsuario();
  }

  getInfoUsuario(){
    this.loginService.getUserInfo().on("value",(snapshot)=>{console.log(snapshot.val())});
  }
  
  register() {
    if (this.user.password === this.user.password2) {
      this.messagesService.showLoadingMessage('Registrando usuario...');
      this.loginService.register(this.user).then(
        response => {
          this.loginService.setUserInfo(this.userInfo);
          localStorage.setItem('token',response.user.refreshToken);
          this.navCtrl.setRoot(this.home);
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
