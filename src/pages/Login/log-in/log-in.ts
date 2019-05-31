import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import {
  RegistroPage,
  RestablecerContraPage,
  TabsPage,
  OpcionesPage,
  HomePage
} from "../../index.paginas";
import { User } from "../../../shared/models/user";

import {
  LoginService,
  MessagesService
} from "../../../services/index.services";

@Component({
  selector: "page-log-in",
  templateUrl: "log-in.html"
})
export class LogInPage {
  registro: any = RegistroPage;
  olvidar: any = RestablecerContraPage;

  user = {} as User;
  email: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginService: LoginService,
    private messagesService: MessagesService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LogInPage");
  }

  login() {
    this.messagesService.showLoadingMessage("Autenticando...");
    this.loginService.login(this.user).then(
      result => {
        this.loginService.getUserInfo().on("value", snapshot => {
          this.saveData(result, snapshot);
          this.checkRole(snapshot.child("rol").val());
        });
        this.messagesService.hideLoadingMessage();
      },
      error => {
        this.messagesService.showMessage(
          "Error",
          this.loginService.getLoginErrorMessage(error.code),
          ["Aceptar"]
        );
        this.messagesService.hideLoadingMessage();
      }
    );
  }

  saveData(result, snapshot) {
    const data = {
      token: result.user.refreshToken,
      nombre: snapshot.child("nombre").val(),
      estado: snapshot.child("estado").val(),
      rol: snapshot.child("rol").val()
    };
    localStorage.setItem("data", JSON.stringify(data));
  }

  checkRole(rol) {
    if (rol === "PARTICIPANTE") {
      this.navCtrl.setRoot(TabsPage);
    } else if (rol === "ADMIN") {
      this.navCtrl.setRoot(OpcionesPage);
    }
  }
}
