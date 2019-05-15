import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation} from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})

export class MapaPage implements OnInit {

  constructor(
    
    private geolocation: Geolocation
    ) {


  }
  ngOnInit(){
    this.loadMap();
  }

  async loadMap()
  {
    const rta = await this.geolocation.getCurrentPosition();

    const myLatLng =
    {
      lat:rta.coords.latitude,
      lng: rta.coords.longitude
    };
    console.log(myLatLng);
    const mapEle: HTMLElement =document.getElementById('map');

    const map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

  }


}
