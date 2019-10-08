import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { TabsPage } from "../pages/tabs/tabs";
import { LogInPage, OpcionesPage } from "../pages/index.paginas";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      this.rootPage = TabsPage;
      // this.checkSession();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  checkSession() {
    const data = JSON.parse(localStorage.getItem("data"));
    if (data) {
      this.checkRole(data.rol);
    } else {
      this.rootPage = LogInPage;
    }
  }

  checkRole(rol) {
    if (rol === "PARTICIPANTE") {
      this.rootPage = TabsPage;
    } else if (rol === "ADMIN") {
      this.rootPage = OpcionesPage;
    }
  }
}
