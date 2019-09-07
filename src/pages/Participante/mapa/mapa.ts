import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

import { AlertController } from "ionic-angular";

import { Geolocation } from "@ionic-native/geolocation";
import { LocationAccuracy } from "@ionic-native/location-accuracy";

import { Ubicacion } from "../../../shared/models/ubicacion.model";

import L from "leaflet";

import {
  MessagesService,
  ParticipanteService
} from "../../../services/index.services";

@Component({
  selector: "page-mapa",
  templateUrl: "mapa.html"
})
export class MapaPage implements OnInit {
  @ViewChild("mapid") mapid: ElementRef;

  public map: any;
  public gpsActivado: boolean;

  public ubicaciones: Array<Ubicacion>;
  public ubicacionesSeleccionadas: Array<any>;
  public marcadores: Array<any>;
  public marcadoresGroup: any;
  public marcadorUbicacion: any;
  public bounds: any;

  constructor(
    private geolocation: Geolocation,
    readonly locationAccuracy: LocationAccuracy,
    private messagesService: MessagesService,
    readonly alertCtrl: AlertController,
    private participanteService: ParticipanteService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    if (!this.map) {
      this.loadMap();
    }
    this.cargarUbicaciones();
    this.activarGeolocalizacion();
  }

  ionViewDidEnter() {
    this.ubicar();
  }

  cargarUbicaciones() {
    this.ubicaciones = [];
    this.ubicacionesSeleccionadas = [];
    this.marcadoresGroup = null;
    this.messagesService.showLoadingMessage("Cargando Ubicaciones");
    this.participanteService.getUbicaciones().then(
      result => {
        result.forEach(doc => {
          this.ubicaciones.push(doc.data());
        });
        this.messagesService.hideLoadingMessage();
      },
      error => {
        this.messagesService.hideLoadingMessage();
      }
    );
  }

  mostrarUbicaciones() {
    const alert = this.alertCtrl.create();
    alert.setTitle("Ubicaciones");
    this.ubicaciones.forEach(ubicacion => {
      alert.addInput({
        type: "checkbox",
        label: ubicacion.nombre,
        value: ubicacion.id,
        checked: this.ubicacionesSeleccionadas.indexOf(ubicacion.id) !== -1
      });
    });
    alert.addButton("Cancelar");
    alert.addButton({
      text: "Aceptar",
      handler: data => {
        this.ubicacionesSeleccionadas = data;
        this.agregarMarcadores();
      }
    });
    alert.present();
  }

  agregarMarcadores() {
    if (this.marcadoresGroup) {
      this.map.removeLayer(this.marcadoresGroup);
    }
    this.marcadores = [];
    this.marcadoresGroup = null;
    this.ubicacionesSeleccionadas.forEach(idUbicacion => {
      const ubicacion: Ubicacion = this.ubicaciones.filter(
        u => u.id == idUbicacion
      )[0];
      this.marcadores.push(
        L.marker([ubicacion.latlng.lat, ubicacion.latlng.lng])
          // .bindPopup(`${ubicacion.nombre}<br>${ubicacion.direccion}`))
          .on("click", e => {
            this.messagesService.showMessage(
              ubicacion.nombre,
              ubicacion.direccion,
              ["Aceptar"]
            );
          })
      );
    });
    this.marcadoresGroup = L.layerGroup(this.marcadores);
    this.marcadoresGroup.addTo(this.map);
    if (this.marcadores.length > 0) {
      const last = this.marcadores[this.marcadores.length - 1];
      this.map.flyTo([last._latlng.lat, last._latlng.lng]);
    }
  }

  loadMap() {
    this.map = L.map("mapid");
    this.map.attributionControl.setPrefix("");
    const ne = L.latLng(24.126130582800734, -104.74674224853517);
    const sw = L.latLng(23.889918576743234, -104.50057983398439);
    this.bounds = L.latLngBounds(ne, sw);
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", //"../assets/map/{z}/{x}/{y}.png", 
      {
        maxZoom: 16,
        minZoom: 12
      }
      
    ).addTo(this.map);
    this.map.setMaxBounds(this.bounds);
    this.map.fitBounds(this.bounds);
    this.map.on("drag", e => {
      this.map.panInsideBounds(this.bounds, { animate: false });
    });
    this.map.setView(new L.LatLng(24.01887060790728, -104.62554931640626), 14);
  }

  ubicar() {
    if (this.gpsActivado) {
      this.geolocation.getCurrentPosition().then(
        response => {
          if(this.marcadorUbicacion){
            this.map.removeLayer(this.marcadorUbicacion);
          }
          this.marcadorUbicacion = L.marker([
            response.coords.latitude,
            response.coords.longitude
          ]);
          this.map.addLayer(this.marcadorUbicacion);
          this.map.flyTo(response.coords.latitude, response.coords.longitude);
        },
        error => {}
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

  ionViewDidLeave() {
    if (this.marcadoresGroup) {
      this.map.removeLayer(this.marcadoresGroup);
      this.marcadoresGroup = null;
    }
    if (this.marcadorUbicacion) {
      this.map.removeLayer(this.marcadorUbicacion);
    }
  }
}
