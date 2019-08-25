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
  public marker = { w: 32, h: 32 };

  constructor(
    private navParams: NavParams,
    private platform: Platform,
    private renderer: Renderer,
    private messagesService: MessagesService
  ) {
    this.region = this.navParams.get('ccbRegion');
    const indexRegion = this.ccbRegions.map(r => r.nombre).indexOf(this.region);
    this.centerRegion = { x: this.ccbRegions[indexRegion].centerX, y: this.ccbRegions[indexRegion].centerY };
    console.log(this.region);
  }

  ionViewWillEnter() {
    this.messagesService.showLoadingMessage("Cargando...");
  }

  ionViewDidLoad() {
    this.init();
  }

  ionViewDidEnter() {
    this.drawImages();
    this.messagesService.hideLoadingMessage();
  }

  init() {
    this.canvas = this.canvasEl.nativeElement;
    this.physicalWidth = this.platform.width();
    this.physicalHeight = this.platform.height();
    this.lastX = this.centerRegion.x - this.physicalWidth / 2;
    this.lastY = this.centerRegion.y - this.physicalHeight / 2;
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

  dragEvent(event) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (event.additionalEvent == 'panleft')
      this.lastX += 50 * (event.deltaTime / 1000);
    if (event.additionalEvent == 'panright')
      this.lastX -= 50 * (event.deltaTime / 1000);
    if (event.additionalEvent == 'panup')
      this.lastY += 50 * (event.deltaTime / 1000);
    if (event.additionalEvent == 'pandown')
      this.lastY -= 50 * (event.deltaTime / 1000);

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
    this.ctx.drawImage(this.mapa, this.lastX, this.lastY, this.physicalWidth, this.physicalHeight, 0, 0, this.physicalWidth, this.physicalHeight);

    //MARKER
    if (this.centerRegion.x >= this.lastX - this.physicalWidth && this.centerRegion.x <= this.lastX + this.physicalWidth
      && this.centerRegion.y >= this.lastY && this.centerRegion.y <= this.lastY + this.physicalHeight)
      this.ctx.drawImage(this.pointer, this.physicalWidth / 2 - this.marker.w / 2, this.physicalHeight / 2 - this.marker.h / 2,
        this.marker.w, this.marker.h);
  }

}