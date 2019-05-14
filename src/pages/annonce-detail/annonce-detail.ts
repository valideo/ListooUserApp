import { TabsPage } from './../tabs/tabs';
import { FcmProvider } from './../../providers/fcm/fcm';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-annonce-detail',
  templateUrl: 'annonce-detail.html',
})
export class AnnonceDetailPage {

  annonceSelected;
  idAnnonce : number = 0;
  idRestoUser : number = 0;
  restoName : string = "";
  desc : string = "";
  address : string = "";
  piUrl : string = "";
  restoType : string = "";
  tel : string = "";
  initialPrice : number = 10000;
  finalPrice : number = 3000;
  qtite : number = 0;
  qtiteSelected : number = 1;
  orderTotal : number = 0;
  startHour;
  endHour;
  qtiteLeft : number = 0;
  horaires : string = "";
  finishOrder : boolean = false;
  detailOrder : boolean = false;
  orderTotalBil : number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, private launchNavigator: LaunchNavigator, private fcm : FcmProvider, private localNotifications: LocalNotifications, private alertCtrl : AlertController) {
    this.annonceSelected = this.navParams.get("annonce");
    this.finishOrder = this.navParams.get("finishOrder");
    this.detailOrder = this.navParams.get("detailOrder");
    console.log(this.annonceSelected);
    this.init();
  }

  init(){
    this.idAnnonce = this.annonceSelected["idAnnonce"];
    this.idRestoUser = this.annonceSelected["idUserResto"];
    this.restoName = this.annonceSelected["restoName"];
    this.address = this.annonceSelected["address"];
    this.piUrl = this.annonceSelected["piUrl"];
    this.restoType = this.annonceSelected["restoType"];
    this.tel = this.annonceSelected["tel"];
    this.initialPrice = this.annonceSelected["initialPrice"];
    this.finalPrice = this.annonceSelected["price"];
    this.orderTotal = this.annonceSelected["price"];
    this.qtite = this.annonceSelected["qtite"];
    this.orderTotalBil = this.finalPrice * this.qtite;
    this.startHour = new Date(this.annonceSelected["startHour"]);
    this.endHour = new Date(this.annonceSelected["endHour"]);
    this.desc = this.annonceSelected["desc"];
    this.convertValues(); 
    console.log(this.idRestoUser); 
  }

  convertValues(){

    this.apiProvider.apiGetCommandesByAnnonce(this.idAnnonce).then(data =>{
      
      var nbReserved = 0;
      var orders : any = data;
      orders.forEach(element => {
        nbReserved += element["qtite"]
      });
      this.qtiteLeft = this.qtite - nbReserved;
    },err =>{

    });

    this.horaires = this.startHour.toLocaleTimeString().substring(0, this.startHour.toLocaleTimeString().length - 3) + " - " + this.endHour.toLocaleTimeString().substring(0, this.endHour.toLocaleTimeString().length - 3);
    

  }

  completeOrder(){
    if(!this.finishOrder)
      this.navCtrl.push(AnnonceDetailPage, {finishOrder : true, annonce : this.annonceSelected});
    else{
      var today = new Date();
      this.apiProvider.apiGetCommandesByAnnonce(this.idAnnonce).then(data =>{
      
        var nbReserved = 0;
        var orders : any = data;
        orders.forEach(element => {
          nbReserved += element["qtite"]
        });
        this.qtiteLeft = this.qtite - nbReserved;
        if(this.qtiteLeft >= this.qtiteSelected){
          this.apiProvider.apiCreateCommande(this.idAnnonce, this.qtiteSelected, today).then(data =>{
            console.log(data);
            this.localNotifications.schedule([{
              id: 1,
              title : 'Votre commande Listoo',
              text: 'Votre commande sera prête dans 1h30 !',
              trigger: {at: new Date(this.startHour.getTime() - 5400)},
             },{
              id: 2,
              title : 'Votre commande Listoo',
              text: 'Votre commande sera prête dans 10 minutes !',
              trigger: {at: new Date(this.startHour.getTime() - 600)},
            }]);
            let alert = this.alertCtrl.create({
              title: 'Reservación confirmada !',
              subTitle: '<p>'+this.horaires + "</p></br><p>"+ this.address+'</p>',
              message: 'Total : $'+this.orderTotal,
              cssClass : 'alertOrderConfirm',
              buttons: [
                {
                  text: 'Volver al inicío',
                  handler: () => {
                    this.navCtrl.setRoot(TabsPage);
                    console.log('Cancel clicked');
                  }
                },
              ]
            });
            alert.present();
          
            this.fcm.notifPanierRecup(this.idRestoUser).then(dataNotif =>{
              console.log(dataNotif);
            }, err =>{
              console.log(err);
            });
          }, err =>{
            console.log(err);
          });
        }
        else
          this.apiProvider.presentToast("La quantité sélectionée n'est plus disponible.")
      },err =>{
  
      });
      
    }
  }


  goBack(){
    this.navCtrl.pop();
  }

  addQtite(){
    if(this.qtiteSelected < 10 && this.qtiteSelected < this.qtiteLeft)
      this.qtiteSelected += 1;
    
    this.orderTotal =  this.initialPrice*0.3*this.qtiteSelected;
  }

  removeQtite(){
    if(this.qtiteSelected > 1)
      this.qtiteSelected -= 1;

    this.orderTotal =  this.initialPrice*0.3*this.qtiteSelected;
  }

  openMap(){
    this.launchNavigator.navigate(this.address).then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }

}
