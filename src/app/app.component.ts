import { ApiProvider } from './../providers/api/api';
import { HomePage } from '../pages/home/home';
import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  userId : number = 0;

  constructor(platform: Platform, statusBar: StatusBar, private fcm: FCM, private apiProvider : ApiProvider, private events : Events) {
    platform.ready().then(() => {

      if (!platform.is('mobileweb') && platform.is('ios') || !platform.is('mobileweb') && platform.is('android') ){
        this.fcm.getToken().then(token => {
          console.log(token);
        });
        events.subscribe('tokenOk', () => {
          this.apiProvider.apiLoadProfile().then(data =>{
            console.log(data["id"]);
            this.fcm.subscribeToTopic('resto'+data["id"]);
          }, err =>{
            console.log(err);
          });
        });
        this.fcm.subscribeToTopic('resto');
        this.fcm.onTokenRefresh().subscribe(token => {
          console.log(token);
        });
  
        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if(data.wasTapped){
            console.log("Received in background");
          } else {
            console.log("Received in foreground");
          };
        });
      }
      statusBar.styleDefault();
    });
  }
}
