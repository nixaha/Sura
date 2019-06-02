import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NavController } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import { LocationAccuracy } from "@ionic-native/location-accuracy";

import L from "leaflet";
import { markParentViewsForCheck } from "@angular/core/src/view/util";
import { MessagesService } from "../../../services/index.services";

declare var google;

@Component({
  selector: "page-mapa",
  templateUrl: "mapa.html"
})
export class MapaPage implements OnInit {
  @ViewChild("mapid") mapid: ElementRef;

  public map: any;
  public gpsActivado: boolean;

  constructor(
    private geolocation: Geolocation,
    readonly locationAccuracy: LocationAccuracy,
    private messagesService: MessagesService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    if(!this.map){
      this.loadMap();
    }
    this.activarGeolocalizacion();
  }

  ionViewDidEnter() {
    this.ubicar();
  }

  loadMap() {
    this.map = L.map("mapid");
    this.map.setView(new L.LatLng(24.0241868, -104.6706912),15);
    // this.map.attributionControl.setPrefix("");
    // const sw = L.latLng(24.100790747617285, -104.72494125366212);
    // const ne = L.latLng(23.94160507253009, -104.50231790542604);
    // this.bounds = L.latLngBounds(sw, ne);
    L.tileLayer(
      /*entorno.map*/ "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 16,
        minZoom: 11
      }
    ).addTo(this.map);
    // this.map.setMaxBounds(this.bounds);
    // this.fitBounds(this.bounds);
    // this.map.on("drag", e => {
    //   this.map.panInsideBounds(this.bounds, { animate: false });
    // });
  }

  ubicar() {
    if (this.gpsActivado) {
      this.geolocation.getCurrentPosition().then(
        response => {
          this.messagesService.showMessage("test", JSON.stringify(response), [
            "Ok"
          ]);
          const marker = L.marker([
            response.coords.latitude,
            response.coords.longitude
          ]);
          marker.addTo(this.map);
          // this.map.add(
          //   new L.marker([response.coords.latitude, response.coords.longitude])
          // );
        },
        error => { }
      );
    }
  }

  activarGeolocalizacion() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        this.locationAccuracy
          .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
          .then(
            success => {
              this.gpsActivado = true;
              this.ubicar();
            },

            error => (this.gpsActivado = false)
          );
      } else {
        this.gpsActivado = false;
      }
    });
  }

  // async loadMap()
  // {
  //   const rta = await this.geolocation.getCurrentPosition();

  //   const myLatLng =
  //   {
  //     lat:rta.coords.latitude,
  //     lng: rta.coords.longitude
  //   };
  //   console.log(myLatLng);
  //   const mapEle: HTMLElement =document.getElementById('map');

  //   const map = new google.maps.Map(mapEle, {
  //     center: myLatLng,
  //     zoom: 12
  //   });

  // }
}
