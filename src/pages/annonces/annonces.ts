import { AnnonceDetailPage } from './../annonce-detail/annonce-detail';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-annonces',
  templateUrl: 'annonces.html',
})
export class AnnoncesPage {

  annonces : any = [];
  annoncesDetail : any = [];
  paniersDispo : boolean = false;
  categoriesArray : any = [];
  showSB : boolean = false;
  searchString : string = "";
  noPanierText : string = "";
  showNoPanierText : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider : ApiProvider, private alertCtrl : AlertController, public loadingCtrl: LoadingController) {

  }

  init(){
    this.annoncesDetail = [];
    this.showNoPanierText = false;
    let loading = this.loadingCtrl.create({
      content: 'Cargando...',
      spinner : 'crescent'
    });
    loading.present();
    this.loadAnnonces().then(data =>{
      this.annoncesDetail = data;
      loading.dismiss();
      if(!data){
        this.showNoPanierText = true;
      }
    }, err => {
      loading.dismiss();
    });
  }

  loadAnnonces() : Promise<any>{
    return new Promise((resolve, reject) => {
      var annonceDetailTemp = [];
      this.apiProvider.apiGetAllAnnonces().then(data =>{
        this.annonces = data;
        this.annonces.forEach(annonce => {
          this.apiProvider.apiLoadResto(annonce["idRestoUser"]).then(dataResto =>{
            var type = this.getTypeName( dataResto["restoType"]);
            var address = dataResto["address"] + ", " + dataResto["city"];
            var picName = annonce["piUrl"].substring(1, annonce["piUrl"].length-1);
            var qtiteLeft = 0;
            this.apiProvider.apiGetCommandesByAnnonce(annonce["id"]).then(data =>{
        
              var nbReserved = 0;
              var orders : any = data;
              orders.forEach(element => {
                nbReserved += element["qtite"]
              });
              qtiteLeft = annonce["qtite"] - nbReserved;
              var detailObject = { idAnnonce : annonce["id"], idUserResto : annonce["idRestoUser"] ,restoName : dataResto["restoName"], typeValue : dataResto["restoType"], restoType : type, address : address, tel : dataResto["tel"], piUrl : picName, startHour : annonce["startHour"], endHour : annonce["endHour"], price :  (annonce["price"]*0.3).toLocaleString('es-CO'), initialPrice : (annonce["price"]).toLocaleString('es-CO') , qtite :  annonce["qtite"], desc : annonce["desc"], qtiteLeft : qtiteLeft };
              this.checkFilters(detailObject).then(data =>{
                if(data == true)
                  annonceDetailTemp.push(detailObject);
              });
            });
          }, err =>{
            console.log(err);
          });
        });
        this.noPanierText = "Ningún paquete disponible por el momento.";
        resolve(annonceDetailTemp);
      }, err =>{
        console.log(err);
      })
  });
}

  showSearchBar(){
    this.showSB = true;
  }
  hideSearchBar(){
    this.showSB = false;
  }

  onInput(){
    if(this.searchString != "" && this.searchString != null && this.searchString != undefined ){

      this.annoncesDetail = [];
      let loading = this.loadingCtrl.create({
        content: 'Cargando...',
        spinner : 'crescent'
      });
      loading.present();
      this.loadAnnoncesInput().then(data =>{
        loading.dismiss();
        console.log(data);
        if(data.length <= 0){
          this.showNoPanierText = true;
        }
      }, err => {
        loading.dismiss();
      });
    }
  }

  loadAnnoncesInput() : Promise<any>{
    return new Promise((resolve, reject) => {
      this.apiProvider.apiLoadRestosWithFilter(this.searchString).then(data =>{

        this.annonces = data;
        this.annonces.forEach(dataResto => {

        this.apiProvider.apiGetAnnonceByResto(dataResto["id"]).then(dataAnnonce =>{

          var type = this.getTypeName( dataResto["restoType"]);
          var address = dataResto["address"] + ", " + dataResto["city"];
          var picName = dataAnnonce["piUrl"].substring(1, dataAnnonce["piUrl"].length-1);
          var qtiteLeft = 0;
          this.apiProvider.apiGetCommandesByAnnonce(dataAnnonce["id"]).then(data =>{
      
            var nbReserved = 0;
            var orders : any = data;
            orders.forEach(element => {
              nbReserved += element["qtite"]
            });
            qtiteLeft = dataAnnonce["qtite"] - nbReserved;
            var detailObject = { idAnnonce : dataAnnonce["id"], idUserResto : dataAnnonce["idRestoUser"] ,restoName : dataResto["restoName"], typeValue : dataResto["restoType"], restoType : type, address : address, tel : dataResto["tel"], piUrl : picName, startHour : dataAnnonce["startHour"], endHour : dataAnnonce["endHour"], price :  (dataAnnonce["price"]*0.3).toLocaleString('es-CO'), initialPrice : (dataAnnonce["price"]).toLocaleString('es-CO') , qtite :  dataAnnonce["qtite"], desc : dataAnnonce["desc"], qtiteLeft : qtiteLeft };
            this.checkFilters(detailObject).then(data =>{
              if(data == true)
                this.annoncesDetail.push(detailObject);
            });
          },err =>{
      
          });
        }, err =>{
          console.log(err);
        });
      });
      resolve(this.annoncesDetail);     
      }, err =>{
        console.log(err);
      });
  });
}

  checkFilters(annonceToCheck) : Promise<Boolean>{
      this.noPanierText = "";
      return new Promise((resolve, reject) => {
        this.apiProvider.apiGetCommandesByAnnonce(annonceToCheck["idAnnonce"]).then(data =>{
          var nbReserved = 0;
          var orders : any = data;
          orders.forEach(element => {
            nbReserved += element["qtite"]
          });
          this.noPanierText = "Ningún paquete disponible por el momento.";
          var toReturn = true;
          if(this.paniersDispo){
  
            if(nbReserved >= annonceToCheck["qtite"]){
              toReturn = false;
            }
          this.noPanierText = "Ningún resultado.";
          }
          if(this.categoriesArray["length"] > 0){
            if(this.categoriesArray.indexOf(annonceToCheck["typeValue"]) < 0){
              toReturn = false;
            }
            this.noPanierText = "Ningún resultado.";
          }
          resolve(toReturn);
        });
   });
  }

  showFilters() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Filtrar por tipo de restaurante :');

    this.addAlertInputs(alert, "pizza");
    this.addAlertInputs(alert, "burger");
    this.addAlertInputs(alert, "jap");
    this.addAlertInputs(alert, "pol");
    this.addAlertInputs(alert, "col");
    this.addAlertInputs(alert, "bowl");
    this.addAlertInputs(alert, "hot");
    this.addAlertInputs(alert, "sushi");
    this.addAlertInputs(alert, "des");
    this.addAlertInputs(alert, "asi");
    this.addAlertInputs(alert, "mexi");
    this.addAlertInputs(alert, "ita");
    this.addAlertInputs(alert, "ara");
    this.addAlertInputs(alert, "chu");
    this.addAlertInputs(alert, "car");
    this.addAlertInputs(alert, "peru");
    this.addAlertInputs(alert, "empa");
    this.addAlertInputs(alert, "mar");
    this.addAlertInputs(alert, "sand");
    this.addAlertInputs(alert, "jug");
    this.addAlertInputs(alert, "cafe");
    this.addAlertInputs(alert, "post");

    alert.addButton({
      text: 'Filtrar',
      handler: data => {
        this.categoriesArray = data;
        this.init();
      }
    });
    alert.present();
  }

  addAlertInputs(alert, value){
    var isChecked = false;
    if(this.categoriesArray.indexOf(value) >= 0)
      isChecked = true;
    alert.addInput({
      type: 'checkbox',
      label: this.getTypeName(value),
      value: value,
      checked : isChecked
    });
  }

  paniersDispoChanged(event){
    this.init();
  }

  goToDetail(annonce){
    this.navCtrl.push(AnnonceDetailPage, {annonce : annonce});
  }

  getTypeName(type : string){
    if(type == "pizza")
      return "Pizza";
    else if(type == "burger")
      return "Hamburguesería";
    else if(type == "jap")
      return "Japonesa";
    else if(type == "pol")
      return "Pollo";
    else if(type == "col")
      return "Colombiana";
    else if(type == "bowl")
      return "Bowl";
    else if(type == "hot")
      return "Hot dog";
    else if(type == "sushi")
      return "Sushi";
    else if(type == "des")
      return "Desayunos";
    else if(type == "asi")
      return "Asiática";
    else if(type == "mexi")
      return "Mexicana";
    else if(type == "ita")
      return "Italiana";
    else if(type == "ara")
      return "Árabe";
    else if(type == "chu")
      return "Chuzo";
    else if(type == "car")
      return "Carne";
    else if(type == "peru")
      return "Peruana";
    else if(type == "empa")
      return "Empanadas";
    else if(type == "mar")
      return "Del mar";
    else if(type == "sand")
      return "Sándwich";
    else if(type == "jug")
      return "Jugos";
    else if(type == "cafe")
      return "Cafès";
    else if(type == "post")
      return "Postres";
  }

  ionViewWillEnter(){
   this.init();
  }

}
