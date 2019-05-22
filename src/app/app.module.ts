import { ComponentsModule } from './../components/components.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { CommandesPage } from './../pages/commandes/commandes';
import { ProfilPage } from './../pages/profil/profil';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from './../pages/register/register';
import { LoginPage } from './../pages/login/login';
import { PwforgotPage } from '../pages/pwforgot/pwforgot';
import { AnnoncesPage } from './../pages/annonces/annonces';
import { AnnonceDetailPage } from './../pages/annonce-detail/annonce-detail';
import { ListooInfosPage } from './../pages/listoo-infos/listoo-infos';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { FcmProvider } from '../providers/fcm/fcm';
import { HttpClientModule } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Keyboard } from '@ionic-native/keyboard';
import { Facebook } from '@ionic-native/facebook';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@NgModule({
  declarations: [
    MyApp,
    CommandesPage,
    ProfilPage,
    TabsPage, 
    HomePage,
    RegisterPage,
    LoginPage,
    AnnoncesPage,
    AnnonceDetailPage,
    PwforgotPage,
    ListooInfosPage
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{ scrollAssist: false, autoFocusAssist: false }),
    HttpClientModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CommandesPage,
    ProfilPage,
    TabsPage,
    HomePage,
    RegisterPage,
    LoginPage,
    PwforgotPage,
    AnnoncesPage,
    AnnonceDetailPage,
    ListooInfosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider, 
    NativeStorage,
    FCM,
    LocalNotifications,
    LaunchNavigator,
    FcmProvider,
    Keyboard,
    Facebook,
    InAppBrowser
  ]
})
export class AppModule {}
