import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  email : string = "";
  password : string = "";
  fName : string = "";
  sName : string = "";
  tel : string = "";
  address : string = "";
  city : string = "";
  zip : string = "";
  restoName : string = "";
  restoType : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider) {
  }

  clickRegister(){
    if(this.email != "" && this.password != "" && this.sName != "" && this.fName != "" && this.address != "" && this.city != "" && this.zip != "" && this.tel != "" && this.restoName != "" && this.restoType){
      this.register();
    }else{
      this.apiProvider.presentToast("Veuillez remplir tous les champs");
    }
  }

  register(){
    this.apiProvider.apiRegister(this.email, this.password, this.sName, this.fName, this.address, this.city, this.zip, this.tel, this.restoName, this.restoType).then(data =>{
      this.navCtrl.pop();
    }, err =>{

    });
  }

}
