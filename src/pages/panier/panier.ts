import { TabsPage } from '../../pages/tabs/tabs';
import { ConfigPanierPage } from './../config-panier/config-panier';
import { StartConfigPage } from './../start-config/start-config';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, DateTime } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-panier',
  templateUrl: 'panier.html',
})
export class PanierPage {

  todayDate : Date = new Date(Date.parse(Date()));
  dateFormated : string = "";
  isPublished : boolean = false;
  imgUrl : string = "http://5.51.150.55:8080/uploads/defaultPic.jpg";
  nbReserved : number = 0;
  nbRestants : number = 0;
  hasAnnonce : boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, public modalCtrl : ModalController, public events : Events, public imagePicker : ImagePicker, private transfer: FileTransfer) {
    var currentMonth = (this.todayDate.getMonth() + 1);
    var currentMonthString;
    if(currentMonth < 10)
      currentMonthString = "0"+currentMonth;
    else
      currentMonthString = currentMonth;
    this.dateFormated = this.todayDate.getUTCDate()+"/"+currentMonthString+"/"+this.todayDate.getFullYear();
  }

  init(){

    this.apiProvider.apiGetAnnonce().then(data =>{
      this.hasAnnonce = true;
      if(data["isActive"] == true)
        this.isPublished = true; 
      if(data["piUrl"] != ""){
        var picName = data["piUrl"].substring(1, data["piUrl"].length-1);
        this.imgUrl = "http://5.51.150.55:8080/uploads/"+ picName;
      }
      if(this.checkDate(data["startHour"]) == false){
        console.log("panier à mettre à jour");
        this.showStartConfig("edit");
      }else{
        console.log("panier à jour");
      }

    this.apiProvider.apiGetCommandes().then(dataC=>{
      this.nbReserved = 0;
      var orders : any = dataC;
      orders.forEach(element => {
        this.nbReserved += element["qtite"]
      });
      this.nbRestants = data["qtite"] - this.nbReserved;
    }, err =>{

    });
        
    },err =>{
      if(err["status"] == 404){
        this.showStartConfig("first");
        this.hasAnnonce = false;
      }
    })
  }

  activeAnnonce(){
    this.apiProvider.apiChangeAnnonceState(true).then(data=>{
      this.isPublished = true;
    }, err =>{

    })
  }

  disableAnnonce(){
    this.apiProvider.apiChangeAnnonceState(false).then(data=>{
      this.isPublished = false;
    }, err =>{
      
    })
  }

  showStartConfig(typeModal : string){
    let startConfigModal = this.modalCtrl.create(StartConfigPage,{type : typeModal},{
      cssClass : 'modal-config'
    });
    let configPanierModal = this.modalCtrl.create(ConfigPanierPage,{type : typeModal},{

    });
    startConfigModal.onDidDismiss(data => {
     if(data["data"] == "config"){
      configPanierModal.present();
     }else{
      this.apiProvider.isBlured = "fadeOutBlur";
      this.events.publish('blurChange');
     }
    });

    configPanierModal.onDidDismiss(data => {
      this.navCtrl.setRoot(TabsPage);
     });
    this.apiProvider.isBlured = "fadeInBlur";
    this.events.publish('blurChange');
    startConfigModal.present();
  }

  goDetail(){
    this.navCtrl.push(ConfigPanierPage, {type : "detail"});
  }

  changePicture(){
    var options = {maximumImagesCount : 1, quality : 60, width : 500}
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        mimeType: 'multipart/form-data',
        params : {file : results[i]}
     }
     fileTransfer.upload(results[i], 'http://5.51.150.55:8080/apiImg/upload', options)
      .then((data) => {
        this.apiProvider.apiUpdateImg(data["response"]).then(data=>{
          this.navCtrl.setRoot(TabsPage);
          console.log(data);
        },err=>{
          console.log(err);
        });
      }, (err) => {
        console.log(err);
      })
    }
    }, (err) => { });

  }

  checkDate(datePanierString : string){
    var datePanier = new Date(datePanierString);
    console.log("Panier : " + datePanier.toLocaleString());
    var todayDate : Date = new Date();
    todayDate.setHours(5);
    todayDate.setMinutes(0);
    console.log("Date de comparaison : " + todayDate.toLocaleString());
    if(datePanier.toLocaleString() > todayDate.toLocaleString()){
      console.log("Date panier > Date Now");
      return true;
    }
    else{
      var dateEcart = new Date();
      console.log("Date ecart : " + dateEcart.toLocaleString());

      if(todayDate.toLocaleString() > dateEcart.toLocaleString()){
        console.log("Date panier < Date Now && Date Now < 5h");
        return true;
      }
      else{
        console.log("Date panier < Date Now && Date Now > 5h");
        return false;
      }
    }
  }

  ionViewDidEnter(){
   this.init();
  }

}
