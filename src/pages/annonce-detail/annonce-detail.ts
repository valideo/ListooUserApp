import { TabsPage } from '../tabs/tabs';
import { FcmProvider } from '../../providers/fcm/fcm';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { ApiProvider } from '../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HomePage } from '../home/home';

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
  orderTotal : string;
  startHour;
  endHour;
  qtiteLeft : number = 0;
  horaires : string = "";
  finishOrder : boolean = false;
  detailOrder : boolean = false;
  orderTotalBil : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, private launchNavigator: LaunchNavigator, private fcm : FcmProvider, private localNotifications: LocalNotifications, private alertCtrl : AlertController, private modalCtrl : ModalController) {
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
    this.orderTotalBil = (this.finalPrice * this.qtite).toLocaleString();
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
    var startHourstring = this.startHour.toLocaleTimeString('es-CO');
    var ext = "";
    if(startHourstring.indexOf("p") > 1)
      ext = "pm"
    else
      ext = "am"
    startHourstring = startHourstring.substring(0, startHourstring.length - 9) + ext;

    var endHourString = this.endHour.toLocaleTimeString('es-CO');
    if(endHourString.indexOf("p") > 1)
      ext = "pm"
    else
      ext = "am"
    endHourString = endHourString.substring(0, endHourString.length - 9) + ext;

    this.horaires = startHourstring + " - " + endHourString;
    
  }

  completeOrder(){
    if(!this.finishOrder)
      this.navCtrl.push(AnnonceDetailPage, {finishOrder : true, annonce : this.annonceSelected});
    else{
      if (this.apiProvider.token === '')
        this.goLoginPage();
      else if(!this.apiProvider.isBtnDisabled){
        
      this.apiProvider.isBtnDisabled = true;
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
            console.log(new Date(this.startHour.getTime() - 600).toLocaleTimeString())
            this.localNotifications.schedule([{
              id: 1,
              title : 'Su paquete Listoo.',
              text: 'Su pedido estará disponible en 1h30 !',
              trigger: {at: new Date(this.startHour.getTime() - 5400)},
             },{
              id: 2,
              title : 'Su paquete Listoo.',
              text: 'Su pedido estará disponible en 10 minutos !',
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
            this.apiProvider.isBtnDisabled = false;
          
            this.fcm.notifPanierRecup(this.idRestoUser).then(dataNotif =>{
              console.log(dataNotif);
            }, err =>{
              console.log(err);
            });
          }, err =>{
            console.log(err);
          });
        }
        else{
          const alert = this.alertCtrl.create({
            message: "La cantidad seleccionada no esta disponible.",
            buttons: ['Ok']
          });
        
          alert.present();
        }
      },err =>{
  
      });
      
    }
  }
  }


  goBack(){
    this.navCtrl.pop();
  }

  addQtite(){
    if(this.qtiteSelected < this.qtiteLeft)
      this.qtiteSelected += 1;
    
    this.orderTotal =  ((this.initialPrice*0.3*this.qtiteSelected)*1000).toLocaleString('es-CO');
    console.log(this.initialPrice);
    console.log(this.qtiteSelected);
  }

  removeQtite(){
    if(this.qtiteSelected > 1)
      this.qtiteSelected -= 1;

    this.orderTotal =  ((this.initialPrice*0.3*this.qtiteSelected)*1000).toLocaleString('es-CO');
  }

  openMap(){
    this.launchNavigator.navigate(this.address).then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }

  goLoginPage() {
    let loginModal = this.modalCtrl.create(HomePage);
    loginModal.present();
    // this.navCtrl.push(HomePage);
  }

}
