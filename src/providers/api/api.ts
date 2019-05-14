import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, DateTime, Events, AlertController } from 'ionic-angular';

@Injectable()
export class ApiProvider {

  apiBaseUrl = "http://5.51.150.55:8080/api/";
  token : string = "";
  isBlured : string = "blured";

  constructor(public http: HttpClient,private toastCtrl: ToastController, private events : Events, private alertCtrl : AlertController) {

  }

  presentToast(message : string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'top',
      cssClass: "toast-error"
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  presentAlertOK(message : string) {
    const alert = this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    });
  
    alert.present();
  }

  presentAlertConnexion(message : string) {
    const alert = this.alertCtrl.create({
      message: message,
      buttons: ['Reintentar']
    });
  
    alert.present();
  }

  presentAlertNotif(title : string, message : string) {
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
        text : 'Ver el pedido',
        handler: () => {
          this.events.publish('goOrders');
        }
      }
    ]
    });
    alert.present();
  }


//Users 

  apiLogin(email : string, password: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email,"password": password}
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"users/loginUser/", postData, options).subscribe(data => {
        this.token = data['token'];
        this.events.publish('tokenOk');
        console.log(this.token);
        resolve(data);
      }, err => {
        if(err.status == 400){
          this.presentAlertConnexion('Algunos campos son incorrectos.');
      }else if(err.status == 403 || err.status == 404){
           this.presentAlertConnexion('Email o contrasena incorrecta');
      }else{
        this.presentAlertConnexion('Ha acontecido un error en el servidor');
      }
      });
    });
  }

  apiLoginFB(email : string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email}
    return new Promise((resolve, reject) => {
      this.http.post(this.apiBaseUrl+"users/loginUserFB/", postData, options).subscribe(data => {
        this.token = data['token'];
        this.events.publish('tokenOk');
        console.log(this.token);
        resolve(data);
      }, err => {
        reject(err);
        this.presentAlertConnexion('Ha acontecido un error en el servidor');
      });
    });
  }
  apiSendMail(email : string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email}
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"users/sendMail/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        if(err.status == 500){
          this.presentAlertConnexion('Es imposible enviar el mail de reinicializacion.');
      }
      });
    });
  }

  apiRegister(email : string, password: string, sName : string, fName : string, address : string, city : string, tel : string, age : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email,"password": password, "sName": sName, "fName" : fName, "address" : address, "city": city, "zip" : "01000", "tel" : tel,"age" : age }
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"users/registerUser/", postData, options).subscribe(data => {
        resolve(data);
        this.presentAlertOK("Si cuenta ha sido creada.");
      }, err => {
        if(err.status == 400){
          this.presentAlertConnexion('Algunos campos son incorrectos.');
      }else if(err.status == 403 || err.status == 404){
          this.presentAlertConnexion('Algunos campos son incorrectos.');
      }else{
          this.presentAlertConnexion('Ha acontecido un error en el servidor');
      }
      });
    });
  }

  apiLoadProfile() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"users/me/", options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        this.presentAlertOK("imposible de cargar la informacion, verifique su conexion.");
      });
    });
  }

  apiLoadResto(userId : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"users/"+userId, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        this.presentAlertOK("imposible de cargar la informacion, verifique su conexion.");
      });
    });
  }

  apiLoadRestosWithFilter(queryString : string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"users/filter/"+queryString, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        this.presentAlertOK("imposible de cargar la informacion, verifique su conexion.");
      });
    });
  }

  apiUpdateMe(email:string, sName:string, fName:string, address:string, city:string, tel:string, age:number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let postData = {"email": email,"sName": sName, "fName":fName, "address":address, "city":city, "zip":"01000", "tel":tel, "age":age, "restoName":null, "restoType":null}
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"users/me/",postData, options).subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  //Annonces 

  apiGetAnnonce(id : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"annonce/"+id, options).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  apiGetAnnonceByResto(idResto : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"annonce/resto/"+idResto, options).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  apiGetAllAnnonces() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"annonces/", options).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }


  //Commandes
  apiGetCommandes() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"commandes/user", options).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  apiGetCommandesByAnnonce(id : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"commandes/"+id, options).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  apiCreateCommande(idAnnonce : number, qtite: number, date : Date) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"q": qtite,"idAnnonce": idAnnonce, "date": date}
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"commande/create/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        this.presentAlertOK("No se ha podido registrar el pedido.");
      });
    });
  }
}
