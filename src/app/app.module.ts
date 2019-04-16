import { HeaderBigComponent } from './../components/header-big/header-big';
import { HeaderSmallComponent } from './../components/header-small/header-small';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { CommandesPage } from './../pages/commandes/commandes';
import { PanierPage } from './../pages/panier/panier';
import { ProfilPage } from './../pages/profil/profil';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from './../pages/register/register';
import { LoginPage } from './../pages/login/login';
import { ConfigPanierPage } from './../pages/config-panier/config-panier';
import { StartConfigPage } from './../pages/start-config/start-config';
import { PwforgotPage } from '../pages/pwforgot/pwforgot';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';


@NgModule({
  declarations: [
    MyApp,
    CommandesPage,
    PanierPage,
    ProfilPage,
    TabsPage, 
    HomePage,
    RegisterPage,
    LoginPage,
    ConfigPanierPage,
    StartConfigPage,
    HeaderSmallComponent,
    HeaderBigComponent,
    PwforgotPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CommandesPage,
    PanierPage,
    ProfilPage,
    TabsPage,
    HomePage,
    RegisterPage,
    LoginPage,
    ConfigPanierPage,
    StartConfigPage,
    PwforgotPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider, 
    NativeStorage,
    ImagePicker,
    FileTransfer,
    FCM,
    LocalNotifications
  ]
})
export class AppModule {}
