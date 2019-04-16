import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-commandes',
  templateUrl: 'commandes.html',
})
export class CommandesPage {

  orders : any = [];
  ordersDetail : any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider : ApiProvider) {

  }

  init(){
    this.apiProvider.apiGetCommandes().then(data =>{
      this.ordersDetail = [];
      this.orders = data;
      this.orders.forEach(element => {
        this.apiProvider.apiLoadUser(parseInt(element["idUser"])).then(dataUser =>{
          var order = {isRecup : element["isRecup"], qtite : element["qtite"], fName : dataUser["fName"], sName : dataUser["sName"], date : element["orderDateTime"]};
          this.ordersDetail.push(order);
        }, err =>{

        });
      });
      console.log(this.ordersDetail);
    }, err =>{

    });
  }

  ionViewWillEnter(){
   this.init();
  }

}
