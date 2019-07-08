import { Keyboard } from '@ionic-native/keyboard';
import { HomePage } from '../pages/home/home';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import {Renderer2} from '@angular/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  userId : number = 0;

  constructor(platform: Platform, statusBar: StatusBar, private keyboard : Keyboard, private renderer2 : Renderer2) {
      platform.ready().then(() => {
      let html = document.getElementsByTagName('html').item(0);

        this.keyboard.onKeyboardHide().subscribe(() => {
          this.renderer2.setStyle(html, 'height','101vh')
      });

      this.keyboard.onKeyboardShow().subscribe(() => {
          this.renderer2.setStyle(html, 'height','auto')
      });
      console.log(statusBar);
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#D6D6D6");
    });
  }
}
