import { TabsPage } from '../../pages/tabs/tabs';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Events, ModalController, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-config-panier',
  templateUrl: 'config-panier.html',
})
export class ConfigPanierPage {
  @ViewChild(Slides) slides : Slides;

  prix : number = 10000;
  qtite : number = 1;
  totalGain : number = this.prix*0.3*this.qtite;
  desc : string = "";
  startHour : String = "09:00:00";
  isDisabled : boolean = true;
  endHour : String = "23:00:00";
  piUrl : string = "";
  todayDate : Date = new Date();
  minEnd : string;
  minStart : string;
  endHourDate : Date = new Date();
  startHourDate : Date = new Date();
  type : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public events : Events, public apiProvider : ApiProvider, public modalCtrl : ModalController, public viewCtrl : ViewController) {
    events.subscribe('valuePanier', () => {
      this.totalGain = this.prix*0.3*this.qtite;
    });
    this.type = this.navParams.get("type");
    if(this.type != "first")
      this.loadData();
    this.startHourDate.setHours(9);
    this.endHourDate.setHours(23);
    this.minStart = this.todayDate.toLocaleTimeString();
  }

  slideTo(nb : number){
    this.slides.slideTo(nb, 500);
  }
  loadData(){
    this.apiProvider.apiGetAnnonce().then(data =>{
      this.prix = data["price"];
      this.qtite = data["qtite"];
      this.desc = data["desc"];
      var startHourDateGet = new Date(data["startHour"]);
      this.startHour = startHourDateGet.toLocaleTimeString();
      this.startHourDate.setHours(parseInt(this.startHour.toString().substring(0,2))); 
      this.startHourDate.setMinutes(parseInt(this.startHour.toString().substring(3,5)));
      var endHourDateGet = new Date(data["endHour"]);
      this.endHour = endHourDateGet.toLocaleTimeString();
      this.endHourDate.setHours(parseInt(this.endHour.toString().substring(0,2))); 
      this.endHourDate.setMinutes(parseInt(this.endHour.toString().substring(3,5)));
      this.valueChanged();
    }, err => {

    });
  }

  valueChanged(){
    this.events.publish('valuePanier');
  }

  savePanier(){

    if(this.endHour > this.startHour){
      this.publishAnnonce();
    }else{
      this.apiProvider.presentToast("L'heure de fin de récupération est antérieur à celle de début de récupération !");
    }
  }

  editPanier(){
    let configPanierModal = this.modalCtrl.create(ConfigPanierPage,{type : "edit"},{

    });
    configPanierModal.present();
  }

  dateStartChanged(){
    var hourSelected : number = parseInt(this.startHour.toString().substring(0,2));
    var minEndDate = this.todayDate;
    minEndDate.setHours(hourSelected +1);
    this.minEnd = minEndDate.toLocaleTimeString();
    var minutesSelected : number = parseInt(this.startHour.toString().substring(3,5));
    this.startHourDate.setHours(hourSelected);
    this.startHourDate.setMinutes(minutesSelected);
    this.isDisabled = false;
  }
  

  dismiss(){
    this.viewCtrl.dismiss();
    this.apiProvider.isBlured = "fadeOutBlur";
    this.events.publish('blurChange');
  }

  goBack(){
    this.navCtrl.pop();
  }

  dateEndChanged(){
    var hourSelected : number = parseInt(this.endHour.toString().substring(0,2));
    var minutesSelected : number = parseInt(this.endHour.toString().substring(3,5));
    this.endHourDate.setHours(hourSelected);
    this.endHourDate.setMinutes(minutesSelected);
  }

  publishAnnonce(){
    if(this.type == "first"){
      this.apiProvider.apiCreateAnnonce(this.desc, this.piUrl, this.prix, this.startHourDate, this.endHourDate, this.qtite, false).then(data =>{
        this.dismiss();
      }, err =>{
        
      });
    }else if(this.type == "edit"){
      console.log(this.startHourDate);
      console.log(this.endHourDate);
      this.apiProvider.apiUpdateAnnonce(this.desc, this.prix, this.startHourDate, this.endHourDate, this.qtite).then(data =>{
        this.navCtrl.setRoot(TabsPage);
      }, err =>{
        
      });
    }
    
  }

}