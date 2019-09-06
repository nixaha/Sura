import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Restaurante } from '../../../commons/restaurante';
import{ RestauranteListPage } from "../../index.paginas";
import { map } from 'rxjs/operators';

import { MessagesService } from '../../../services/index.services'

@Component({
  selector: 'page-restaurante',
  templateUrl: 'restaurante.html',
})

export class RestaurantePage {
  private noticiasCollection: AngularFirestoreCollection<Restaurante>;
  public restaurante: Array<Restaurante>;
  restaurantes: Observable<Restaurante[]>;
  public ubicacionesSeleccionadas: Array<any>;
  notiDoc: AngularFirestoreDocument<Restaurante[]>;
  restaurantelist:any = RestauranteListPage;

  public map: any;
  public gpsActivado: boolean;

  public marcadores: Array<any>;
  public marcadoresGroup: any;
  public marcadorUbicacion: any;
  public bounds: any;

  nombre: string ='';
  introduccion: string='';
  horarios: string ='';
  direccion: string ='';
  telefono: string ='';
  imagen: string ='';
  categoria: string ='';

  constructor(public navCtrl: NavController,
    private database: AngularFirestore,
    private messagesService: MessagesService,
    public navParams: NavParams) {
      this.noticiasCollection = database.collection<Restaurante>("restaurantes");
      
      this.restaurantes = this.noticiasCollection.snapshotChanges().pipe(
        map(actions => actions.map(action => {
          const data = action.payload.doc.data() as Restaurante;
          const id = action.payload.doc.id;
          return { id, ...data };
        }))
     );

     this.restaurantes.subscribe(
      result => {
        this.messagesService.hideLoadingMessage();
      }
    )

      this.nombre = this.navParams.get('nombre');
      this.introduccion = this.navParams.get('introduccion');
      this.horarios = this.navParams.get('horarios'); 
      this.direccion = this.navParams.get('direccion');
      this.telefono = this.navParams.get('telefono');
      this.imagen = this.navParams.get('foto');
      this.imagen = this.navParams.get('categoria');
      

    if(this.nombre != null) {
        const id = this.database.createId(); 
        const restaurante: Restaurante = { 'nombre':this.nombre, 'introduccion':this.introduccion, 'horarios':this.horarios, 'direccion':this.direccion, 'telefono':this.telefono, 'imagen':this.imagen, 'categoria': this.categoria};
        this.noticiasCollection.doc(id).set(restaurante); 
        this.navCtrl.push(RestauranteListPage, {
          id: restaurante
        });    
    }
        
  }

  detalles(_restaurante: Restaurante){
    this.navCtrl.push(RestauranteListPage, {
      id: _restaurante
    })
  }
  // mostrarCategorias() {
  //   const alert = this.alertCtrl.create();
  //   alert.setTitle("Categorías");
  //   this.restaurante.forEach(restaurante => {
  //     alert.addInput({
  //       type: "checkbox",
  //       label: restaurante.categoria,
  //       checked: this.ubicacionesSeleccionadas.indexOf
  //     });
  //   });
  //   alert.addButton("Cancelar");
  //   alert.addButton({
  //     text: "Aceptar",
  //     handler: data => {
  //       this.ubicacionesSeleccionadas = data;
  //       this.agregarMarcadores();
  //     }
  //   });
  //   alert.present();
  // }
  // agregarMarcadores() {
  //   if (this.marcadoresGroup) {
  //     this.map.removeLayer(this.marcadoresGroup);
  //   }
  //   this.marcadores = [];
  //   this.marcadoresGroup = null;
  //   this.ubicacionesSeleccionadas.forEach(idUbicacion => {
  //     const ubicacion: Restaurante = this.restaurante.filter(
  //       u => u.categoria == idUbicacion
  //     )[0];
  //     this.marcadores.push(
  //       L.marker([ubicacion.latlng.lat, ubicacion.latlng.lng])
  //         // .bindPopup(`${ubicacion.nombre}<br>${ubicacion.direccion}`))
  //         .on("click", e => {
  //           this.messagesService.showMessage(
  //             ubicacion.nombre,
  //             ubicacion.direccion,
  //             ["Aceptar"]
  //           );
  //         })
  //     );
  //   });
  //   this.marcadoresGroup = L.layerGroup(this.marcadores);
  //   this.marcadoresGroup.addTo(this.map);
  //   if (this.marcadores.length > 0) {
  //     const last = this.marcadores[this.marcadores.length - 1];
  //     this.map.flyTo([last._latlng.lat, last._latlng.lng]);
  //   }
  // }


}

