import { ErrorHandler } from "@angular/core"; // le quite ngmodule
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"; // importar clase para que se puedan agregar componentes ionic botones

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

//Servicios de conexión a firebase y utilerías
import {
  LoginService,
  MessagesService,
  NotificationsService,
  AdminService,
  ParticipanteService
} from "../services/index.services";

import { Geolocation } from "@ionic-native/geolocation";
import { LocationAccuracy } from "@ionic-native/location-accuracy";

import {
  HomePage,
  MapaPage,
  MuseoPage,
  MuseoListPage,
  RestaurantePage,
  RestauranteListPage,
  SouvePage,
  SouveListPage,
  QmasvisitarPage,
  QmasvisitarListPage,
  HotelesPage,
  HotelesListPage,
  GaleriaPage,
  GaleriaListPage,
  ContactPage,
  TabsPage,
  RegistroPage,
  EventosPage,
  EventosComPage,
  EcoturismoListPage,
  AntrosbaresListPage,
  LogInPage,
  RestablecerContraPage,
  OpcionesPage,
  EventosAdminPage,
  AgregarEventoPage,
  EditarEventoPage,
  EliminarEventoPage,
  ItinerariosPage,
  AntrosBaresPage,
  EcoturismoPage,
  TransportesPage,
  TransporteListPage,
  Resposocial,
  Aerolineas,
  // AntrosListPage,
  // EcoListPage,
  AgregarItiPage,
  EditarItiPage,
  EliminarItiPage
} from "../pages/index.paginas";

const config = {
  apiKey: "AIzaSyA8z3MU_XvgW4WnddejtoIEklLbUvmkh2I",
  authDomain: "suraapp-e18e3.firebaseapp.com",
  databaseURL: "https://suraapp-e18e3.firebaseio.com",
  projectId: "suraapp-e18e3",
  storageBucket: "suraapp-e18e3.appspot.com",
  messagingSenderId: "163347150648"
};

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

//firebase
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireStorageModule } from "angularfire2/storage";
import { NgIfContext } from "@angular/common";

import { Camera } from "@ionic-native/camera";
import { Push } from "@ionic-native/push";
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapaPage,
    MuseoPage,
    MuseoListPage,
    RestaurantePage,
    RestauranteListPage,
    SouvePage,
    SouveListPage,
    QmasvisitarPage,
    QmasvisitarListPage,
    HotelesPage,
    HotelesListPage,
    GaleriaPage,
    GaleriaListPage,
    EventosPage,
    EventosComPage,
    EcoturismoPage,
    EcoturismoListPage,
    AntrosBaresPage,
    AntrosbaresListPage,
    TransportesPage,
    ContactPage,
    TabsPage,
    RegistroPage,
    LogInPage,
    RestablecerContraPage,
    OpcionesPage,
    EventosAdminPage,
    AgregarEventoPage,
    EditarEventoPage,
    EliminarEventoPage,
    ItinerariosPage,
    AgregarItiPage,
    EditarItiPage,
    EliminarItiPage,
    AntrosBaresPage,
    EcoturismoPage,
    TransportesPage,
    TransporteListPage,
    Resposocial,
    Aerolineas
    // AntrosListPage,
    // EcoListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false
    }),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapaPage,
    MuseoPage,
    MuseoListPage,
    RestaurantePage,
    RestauranteListPage,
    SouvePage,
    SouveListPage,
    QmasvisitarPage,
    QmasvisitarListPage,
    HotelesPage,
    HotelesListPage,
    GaleriaPage,
    GaleriaListPage,
    EventosPage,
    EventosComPage,
    EcoturismoPage,
    EcoturismoListPage,
    AntrosBaresPage,
    AntrosbaresListPage,
    TransportesPage,
    ContactPage,
    TabsPage,
    EventosPage,
    EventosComPage,
    RegistroPage,
    LogInPage,
    RestablecerContraPage,
    OpcionesPage,
    EventosAdminPage,
    AgregarEventoPage,
    EditarEventoPage,
    EliminarEventoPage,
    ItinerariosPage,
    AgregarItiPage,
    EditarItiPage,
    EliminarItiPage,
    AntrosBaresPage,
    EcoturismoPage,
    TransportesPage,
    TransporteListPage,
    Resposocial,
    Aerolineas
    // AntrosListPage,
    // EcoListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    LocationAccuracy,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginService,
    MessagesService,
    NotificationsService,
    AdminService,
    ParticipanteService,
    Camera,
    Push,
<<<<<<< HEAD
    InAppBrowser
=======
    LocalNotifications
>>>>>>> 95fd2ad069be4fa2632a5719d1f5ac4828e89d00
  ],
  schemas: [
    // se agrego por que no se agregaban los botones ionic
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
