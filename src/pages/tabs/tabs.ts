import { Component } from '@angular/core';

import { MapaPage } from '../Participante/mapa/mapa';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../Participante/home/home';

import { App } from "ionic-angular";
import { MessagesService, LoginService } from '../../services/index.services';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MapaPage;
  tab3Root = ContactPage;

  logged;

  constructor(
    private app: App,
    private loginService: LoginService,
    private messagesService: MessagesService
  ) { }

  ionViewDidLoad() { 
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      this.logged = true;
    }else{
      this.logged = false;
    }
  }

  logout() {
    this.messagesService.showMessage(
      "Cerrar sesión",
      "¿Desea cerrar sesión?",
      [
        {
          text: "Aceptar",
          handler: () => {
            this.loginService.logout().then(
              result => {
                localStorage.clear();
                this.app.getRootNav().setRoot(TabsPage);
                // this.app.getRootNav().setRoot(LogInPage);
              }, error => {
                this.messagesService.showMessage('Error', 'Error al cerrar sesión', []);
              }
            );
          }
        },
        {
          text: "Cancelar"
        }
      ]
    );
  }
}
