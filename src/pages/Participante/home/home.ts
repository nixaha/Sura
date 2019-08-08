import { Component } from "@angular/core";
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
import { LogInPage} from "../../index.paginas";

import { NotificationsService } from '../../../services/index.services';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private app: App
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad HomePage");
    this.notificationsService.checkSchedule();
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
      "¿Desea salir de su cuenta?",
      [
        {
          text: "Aceptar",
          handler: () => {
            localStorage.clear();
            this.app.getRootNav().setRoot(LogInPage);
          }
        },
        {
          text: "Cancelar"
        }
      ]
    );
  }
  
}
