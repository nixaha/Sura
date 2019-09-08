import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FabContainer } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  @ViewChild('fabion')fab : FabContainer

  constructor(public navCtrl: NavController, private iab: InAppBrowser) {

  }

  ionViewDidEnter()
  {
    this.fab.toggleList();

  }
  browser1(){
  this.iab.create('http://www.facebook.com/surameetingplanner/?ti=as');
}

browser2(){
  this.iab.create('https://www.instagram.com/surameeting/'); 
}

browser3(){
  this.iab.create('https://twitter.com/MeetingSura?lang=es'); 
}

}
