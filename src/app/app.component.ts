import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LogInPage } from '../pages/index.paginas';

@Component({

  templateUrl: 'app.html'   
})
export class MyApp {
  
  rootPage:any;
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.checkSession();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  checkSession(){
    if(localStorage.getItem('token')){
      this.rootPage = TabsPage;
    }else{
      this.rootPage = LogInPage;
    }
  }

}
