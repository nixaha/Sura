import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { NavController, App } from "ionic-angular";
import { EventosPage } from "../eventos/eventos";
import { MuseoPage } from "../museo/museo";
import { QmasvisitarPage } from "../qmasvisitar/qmasvisitar";
import { RestaurantePage } from "../restaurante/restaurante";
import { SouvePage } from "../souve/souve";
import { HotelesPage } from "../hoteles/hoteles";
import { GaleriaPage } from "../galeria/galeria";
import { AntrosBaresPage } from "../antrosbares/antrosbares";
import { EcoturismoPage } from "../ecoturismo/ecoturismo";
import { TransportesPage } from "../transportes/transportes";
import { MessagesService } from "../../../services/messages.service";
import { LogInPage } from "../../index.paginas";
import { Resposocial } from '../resposocial/resposocial';
import { Aerolineas } from '../aerolineas/aerolineas';
import { CentroCon } from '../ccb/ccb';

import { NotificationsService, LoginService } from '../../../services/index.services';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  logged;
  
  private userName;
  
  constructor(
    platform: Platform,
    public navCtrl: NavController,
    private loginService: LoginService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private app: App
  ) {
    platform.ready().then(() => {
      this.notificationsService.setPushNotification();
      this.notificationsService.checkSchedule();
      const data = localStorage.getItem('data');
      if (data) {
        this.userName = JSON.parse(data).nombre;
        console.log(this.userName)
      }
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HomePage");
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      this.logged = true;
    }else{
      this.logged = false;
    }
  }

  verccb() {
    this.navCtrl.push(CentroCon);
  }
  veraerolineas() {
    this.navCtrl.push(Aerolineas);
  }
  versocial() {
    this.navCtrl.push(Resposocial);
  }
  vereventoss() {
    this.navCtrl.push(EventosPage);
  }
  vermuseos() {
    this.navCtrl.push(MuseoPage);
  }
  verrestaurantes() {
    this.navCtrl.push(RestaurantePage);
  }
  qmasvisitar() {
    this.navCtrl.push(QmasvisitarPage);
  }
  antrosbares() {
    this.navCtrl.push(AntrosBaresPage);
  }
  ecoturismo() {
    this.navCtrl.push(EcoturismoPage);
  }
  transportes() {
    this.navCtrl.push(TransportesPage);
  }

  souvenirs() {
    this.navCtrl.push(SouvePage);
  }

  verhoteles() {
    this.navCtrl.push(HotelesPage);
  }

  vergaleria() {
    this.navCtrl.push(GaleriaPage);
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
                this.app.getRootNav().setRoot(LogInPage);
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
