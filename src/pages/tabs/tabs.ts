import { Component } from '@angular/core';

import { MapaPage } from '../Participante/mapa/mapa';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../Participante/home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MapaPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
