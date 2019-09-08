import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TourOperador } from '../../../shared/models/touroperador.model';
import { ParticipanteService, MessagesService } from '../../../services/index.services';

/**
 * Generated class for the TouroperadoresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-touroperadores',
  templateUrl: 'touroperadores.html',
})
export class TouroperadoresPage {

  private tourOperadores: TourOperador[];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private messagesService: MessagesService,
    private participanteService: ParticipanteService
  ) { }

  ionViewWillEnter() {
    this.tourOperadores = [];
    this.messagesService.showLoadingMessage('Cargando información...')
    this.participanteService.getTourOperadores().then(
      result => {
        result.docs.forEach(doc => {
          console.log(doc.data())
          this.tourOperadores.push(doc.data());
        });
        this.messagesService.hideLoadingMessage();
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TouroperadoresPage');

  }

}
