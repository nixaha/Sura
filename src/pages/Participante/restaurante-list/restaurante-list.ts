import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-restaurante-list',
  templateUrl: 'restaurante-list.html',
})
export class RestauranteListPage {
  restaurante:any = {}; 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.restaurante= this.navParams.get('id');
 
    console.log(navParams + 'imagen restaurante list ts');
    
   
  }

}
