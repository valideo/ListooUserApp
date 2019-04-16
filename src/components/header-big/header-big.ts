import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'header-big',
  templateUrl: 'header-big.html'
})
export class HeaderBigComponent {

  constructor(public navCtrl : NavController ) {
  }

  goPrev(){
    this.navCtrl.pop();
  }

}
