import { NativeStorage } from '@ionic-native/native-storage';
import { ApiProvider } from './../providers/api/api';
import { Keyboard } from '@ionic-native/keyboard';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import {Renderer2} from '@angular/core';
import {TabsPage} from "../pages/tabs/tabs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage : any = TabsPage;
  userId : number = 0;

  constructor(platform: Platform, statusBar: StatusBar, private keyboard : Keyboard, private renderer2 : Renderer2, private apiProvider : ApiProvider, private nativeStorage : NativeStorage) {
    platform.ready().then(() => {
      let html = document.getElementsByTagName('html').item(0);

      this.keyboard.onKeyboardHide().subscribe(() => {
        this.renderer2.setStyle(html, 'height', '101vh')
      });

      this.keyboard.onKeyboardShow().subscribe(() => {
        this.renderer2.setStyle(html, 'height', 'auto')
      });
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#D6D6D6");

      this.nativeStorage.getItem('listooUserCredentials')
      .then(
        data => {
          this.apiProvider.apiLogin(data['email'], data['pass']).then(data => {
            if(data['token'] != ""){
              this.apiProvider.token = data['token'];
            }
          });
        }
      );
    });
  }
}
