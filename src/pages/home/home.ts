import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../../providers/api/api';
import { TabsPage } from '../tabs/tabs';
import { Component } from '@angular/core';
import { NavController, Platform, ViewController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';
import { NativeStorage } from '@ionic-native/native-storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLoggedIn : boolean = false;
  fbUserData : any = [];

  constructor(public navCtrl: NavController, public nativeStorage : NativeStorage, public platform : Platform, public apiProvider : ApiProvider, public splash : SplashScreen, private fb: Facebook) {

    this.platform.ready().then(() => {

    });
  }

  ionViewDidLoad(){
   // this.apiProvider.hideTabs();
  }

  goToLogin(){
    this.navCtrl.push(LoginPage);
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }

  loginFb() {
    this.fb.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.fb.api('me?fields=id,name,email,first_name,last_name', []).then(profile => {
        this.fbUserData = {email: profile['email'], fName: profile['first_name'],  lName: profile['last_name']};
        console.log(this.fbUserData);
        this.verifFbUser(this.fbUserData);
      }, err =>{console.log(err)});
    }, err =>{console.log(err)});
  }

  verifFbUser(userData : any){
    this.apiProvider.apiLoginFB(userData["email"]).then(data =>{
      console.log(data);
      this.navCtrl.setRoot(TabsPage);
    }, err =>{
      console.log("erreur");
      if(err.status == 404){
        console.log("erreur 404");
        this.navCtrl.push(RegisterPage, {userData : userData})
      }
      console.log(err);
    });
  }


}
