import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Museo } from '../../../commons/museo';
import { MuseoPage } from "../../index.paginas";


@Component({
  selector: 'page-museo-list',
  templateUrl: 'museo-list.html',
})
export class MuseoListPage {
  museo:any = {}; 
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.museo= this.navParams.get('id');
 
    console.log(navParams + 'imagen museo list ts');
    
    
  }

}
