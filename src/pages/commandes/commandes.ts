import { AnnonceDetailPage } from './../annonce-detail/annonce-detail';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@Component({
  selector: 'page-commandes',
  templateUrl: 'commandes.html',
})
export class CommandesPage {

  orders : any = [];
  ordersDetail : any = [];
  ordersDetailSorted = [];
  today : Date = new Date();

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider : ApiProvider, private events : Events) {
    events.subscribe('commandesOk', () => {
      this.ordersDetail.sort(function (a, b) {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
    });
  }

  init(){
    this.today = new Date();
    this.apiProvider.apiGetCommandes().then(data =>{
      this.ordersDetail = new Array();
      this.orders = data;
      this.orders.forEach(element => {
        this.apiProvider.apiGetAnnonce(parseInt(element["idAnnonce"])).then(dataAnnonce =>{
          this.apiProvider.apiLoadResto(dataAnnonce["idRestoUser"]).then(dataRestoUser =>{
            var isExpire = false;
            var endHour = new Date(dataAnnonce["endHour"]);
            if(element["isRecup"] == false && this.today > endHour)
              isExpire = true;
            
            var msLeft = (endHour.getTime() - this.today.getTime());
            console.log(endHour.getTime()/1000);
            console.log(endHour.toLocaleString());
            console.log(this.today.getTime()/1000);
            console.log(this.today.toLocaleString());
            console.log(msLeft);
            console.log(new Date(msLeft));
            var timeLeft = Math.floor((msLeft/(1000*60*60))%24) + ' horas ' + Math.floor((msLeft/(1000*60))%60) + ' minutos';
            var picName = dataAnnonce["piUrl"].substring(1, dataAnnonce["piUrl"].length-1);
            var finalPrice = (element["qtite"] * dataAnnonce["price"]*0.3).toLocaleString('es-CO');

            var address = dataRestoUser["address"] + ", " + dataRestoUser["city"];
            var order = {id : element["id"], orderDateTime : element["orderDateTime"], idUserResto : dataAnnonce["idRestoUser"],  isRecup : element["isRecup"], qtite : element["qtite"], restoName : dataRestoUser["restoName"], restoType : dataRestoUser["restoType"], piUrl : picName, finalPrice : finalPrice, timeLeft : timeLeft, isExpire : isExpire, address : address, tel : dataRestoUser["tel"], startHour : dataAnnonce["startHour"], endHour : dataAnnonce["endHour"], price :  dataAnnonce["price"]*0.3, initialPrice : dataAnnonce["price"] , desc : dataAnnonce["desc"]};

            this.ordersDetail.push(order);
          }, err =>{

          });
        }, err =>{

        });
      });
      this.events.publish('commandesOk');
    }, err =>{

    });
  }

  compare(a, b) {
    const idA = a["id"];
    const idB = b["id"];
  
    let comparison = 0;
    if (idA > idB) {
      comparison = 1;
    } else if (idA < idB) {
      comparison = -1;
    }
    return comparison;
  }

  goToDetail(annonce){
      this.navCtrl.push(AnnonceDetailPage, {detailOrder : true, annonce : annonce});
  }

  ionViewWillEnter(){
   this.init();
  }

}
