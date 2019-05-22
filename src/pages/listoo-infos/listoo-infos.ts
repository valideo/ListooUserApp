import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-listoo-infos',
  templateUrl: 'listoo-infos.html',
})
export class ListooInfosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser) {

  }

  openPrivacy(){
    const browser = this.iab.create('https://www.listoo.co/politicas-de-confidencialidades');
  }
  openCGU(){
    const browser = this.iab.create('https://www.listoo.co/cgu');
  }
  openLegale(){
    const browser = this.iab.create('https://www.listoo.co/noticias-legales');
  }

  goBack(){
    this.navCtrl.pop();
  }

}
