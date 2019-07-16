import { ListooInfosPage } from '../listoo-infos/listoo-infos';
import { HomePage } from '../home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import { ApiProvider } from '../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',
})
export class ProfilPage {

  email : string = "";
  fName : string = "";
  sName : string = "";
  tel : string = "";
  address : string = "";
  city : string = "";
  age : number = 10;
  isDisabled : boolean = true;
  btnText : string = "Modificar la información";

  constructor(public app : App, public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, public nativeStorage : NativeStorage) {
    if (this.apiProvider.token !== '')
      this.loadInfos();
  }

  ionViewWillEnter(){
    if (this.apiProvider.token === '')
      this.goLoginPage();
    else
      this.loadInfos();
  }


  loadInfos(){
    this.apiProvider.apiLoadProfile().then(data =>{
      this.email = data["email"];
      this.fName = data["fName"];
      this.sName = data["sName"];
    }, err =>{

    });
  }

  disconnect(){
    this.nativeStorage.remove('listooUserCredentials').then(data=>{
      this.apiProvider.token = "";
      this.app.getRootNav().setRoot(TabsPage);
    }, err =>{
      this.app.getRootNav().setRoot(TabsPage);
    });
  }

  editInfos(){
    if(this.isDisabled == true){
      this.isDisabled = false;
      this.btnText = "Guardar los cambios";
    }else{
      this.apiProvider.apiUpdateMe(this.email, this.sName, this.fName).then(data=>{
        this.isDisabled = true;
        this.btnText = "Modificar la información";
        this.navCtrl.setRoot(ProfilPage);
      }, err =>{
        this.isDisabled = true;
        this.btnText = "Modificar la información";
        this.apiProvider.presentToast("Impossible de mettre à jour les informations.")
      });
    }
  }

  goDetailApp(){
    this.navCtrl.push(ListooInfosPage);
  }

  goLoginPage() {
    this.navCtrl.push(HomePage);
  }

}
