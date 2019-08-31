import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { CCBRegions } from '../../../shared/consts/ccb.region.const';

import { MessagesService } from '../../../services/index.services';

@Component({
  selector: 'ccb',
  templateUrl: 'ccb.html',
})
export class CentroCon {
  @ViewChild('canvas') canvasEl: ElementRef;

  private ccbRegions = CCBRegions;
  private canvas;
  private ctx;
  private mapa;
  private pointer;
  private lastX;
  private lastY;
  private physicalWidth;
  private physicalHeight;
  private region;
  private centerRegion;
  private isCentered;
  private isFullMap;
  private marker = { w: 32, h: 32 };

  constructor(
    private navParams: NavParams,
    private platform: Platform,
    private renderer: Renderer,
    private messagesService: MessagesService
  ) {
    this.region = this.navParams.get('ccbRegion');
    const indexRegion = this.ccbRegions.map(r => r.nombre).indexOf(this.region);
    this.centerRegion = { x: this.ccbRegions[indexRegion].centerX, y: this.ccbRegions[indexRegion].centerY };
    this.isFullMap = false;
  }

  ionViewWillEnter() {
    this.messagesService.showLoadingMessage("Cargando...");
  }

  ionViewDidLoad() {
    this.init();
  }

  ionViewDidEnter() {
    this.setCenterRegion();
    this.messagesService.hideLoadingMessage();
  }

  init() {
    this.canvas = this.canvasEl.nativeElement;
    this.physicalWidth = this.platform.width();
    this.physicalHeight = this.platform.height();
    this.renderer.setElementAttribute(this.canvas, 'width', this.physicalWidth + '');
    this.renderer.setElementAttribute(this.canvas, 'height', this.physicalHeight + '');
    this.ctx = this.canvas.getContext('2d');
    this.loadImages();
  }

  loadImages() {
    this.mapa = document.createElement("img");
    this.mapa.setAttribute("src", "../../assets/imgs/CCB_map.png");
    this.pointer = document.createElement("img");
    this.pointer.setAttribute("src", "../../assets/imgs/pointer.png");
  }

  setCenterRegion() {
    this.lastX = this.centerRegion.x - this.physicalWidth / 2;
    this.lastY = this.centerRegion.y - this.physicalHeight / 2;
    this.isCentered = true;
    this.isFullMap = false;
    this.drawImages();
  }

  setFullMap() {
    this.isFullMap = true;
    this.drawImages();
  }

  dragEvent(event) {
    if (event.additionalEvent == 'panleft') {
      this.lastX += 50 * (event.deltaTime / 1000);
      this.isCentered = false;
    }
    if (event.additionalEvent == 'panright') {
      this.lastX -= 50 * (event.deltaTime / 1000);
      this.isCentered = false;
    }
    if (event.additionalEvent == 'panup') {
      this.lastY += 50 * (event.deltaTime / 1000);
      this.isCentered = false;
    }
    if (event.additionalEvent == 'pandown') {
      this.lastY -= 50 * (event.deltaTime / 1000);
      this.isCentered = false;
    }

    if (this.lastX < 0)
      this.lastX = 0;

    if (this.lastX >= this.mapa.width - this.physicalWidth)
      this.lastX = this.mapa.width - this.physicalWidth;

    if (this.lastY < 0)
      this.lastY = 0;

    if (this.lastY >= this.mapa.height - this.physicalHeight)
      this.lastY = this.mapa.height - this.physicalHeight;

    this.drawImages();
  }

  drawImages() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.isFullMap) {
      const virtualWidth = this.mapa.width;
      const virtualHeight = this.mapa.height;
      const virtualAR = this.mapa.width / this.mapa.height;
      const physicalAR = this.physicalWidth / this.physicalHeight;
      let scale = 0;
      let cropX = 0;
      let cropY = 0;
      if (physicalAR > virtualAR) {
        scale = this.physicalHeight / virtualHeight;
        cropX = (this.physicalWidth - virtualWidth * scale) / 2;
      } else if (physicalAR < virtualAR) {
        scale = this.physicalWidth / virtualWidth;
        cropY = (this.physicalHeight - virtualHeight * scale) / 2;
      } else {
        scale = this.physicalWidth / virtualWidth
      }
      this.ctx.drawImage(this.mapa, 0, 0, this.mapa.width, this.mapa.height, cropX, cropY,
        virtualWidth * scale, virtualHeight * scale);

      this.ctx.strokeStyle = "#FF0000";

      console.log(this.centerRegion.x * scale)

      this.ctx.strokeRect(cropX + (this.centerRegion.x * scale - ((25 / 2))), cropY + (this.centerRegion.y * scale - ((25 / 2))),
        25 , 25);
    } else {
      this.ctx.drawImage(this.mapa, this.lastX, this.lastY, this.physicalWidth, this.physicalHeight, 0, 0, this.physicalWidth, this.physicalHeight);

      if (this.isCentered) {
        this.ctx.drawImage(this.pointer, this.physicalWidth / 2 - this.marker.w / 2, this.physicalHeight / 2 - this.marker.h / 2,
          this.marker.w, this.marker.h);
      }
    }
  }

}