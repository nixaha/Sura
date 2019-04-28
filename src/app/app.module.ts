import { ErrorHandler } from '@angular/core'; // le quite ngmodule
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';// importar clase para que se puedan agregar componentes ionic botones

import{ HomePage,
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
  LogInPage,
  RestablecerContraPage,
  OpcionesPage,
  AgregarEventoPage,
  EditarEventoPage,
  EliminarEventoPage,
  AgregarItiPage,
  EditarItiPage,
  EliminarItiPage} from '../pages/index.paginas';

  const config = {
    apiKey: "AIzaSyA8z3MU_XvgW4WnddejtoIEklLbUvmkh2I",
    authDomain: "suraapp-e18e3.firebaseapp.com",
    databaseURL: "https://suraapp-e18e3.firebaseio.com",
    projectId: "suraapp-e18e3",
    storageBucket: "suraapp-e18e3.appspot.com",
    messagingSenderId: "163347150648"
  };
  

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//firebase 
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule} from 'angularfire2/auth';

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
    ContactPage,
    TabsPage,
    RegistroPage,
    LogInPage,
    RestablecerContraPage,
    OpcionesPage,
    AgregarEventoPage,
    EditarEventoPage,
    EliminarEventoPage,
    AgregarItiPage,
    EditarItiPage,
    EliminarItiPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule
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
    ContactPage,
    TabsPage,
    EventosPage,
    EventosComPage,
    RegistroPage,
    LogInPage,
    RestablecerContraPage,
    OpcionesPage,
    AgregarEventoPage,
    EditarEventoPage,
    EliminarEventoPage,
    AgregarItiPage,
    EditarItiPage,
    EliminarItiPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [ // se agrego por que no se agregaban los botones ionic
    CUSTOM_ELEMENTS_SCHEMA
  ]
  
})
export class AppModule {}
