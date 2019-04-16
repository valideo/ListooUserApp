import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pwforgot',
  templateUrl: 'pwforgot.html',
})
export class PwforgotPage {

  email : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider : ApiProvider, private toastCtrl : ToastController) {
  }


  presentToast(message : string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'top',
      cssClass: "toast-success"
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  valid(){
    if(this.email != ""){
      this.sendMail();
    }
    else{
      this.apiProvider.presentToast("Veuillez remplir votre email");
    }
  }

  sendMail(){
    this.apiProvider.apiSendMail(this.email).then(data =>{
      this.presentToast("Un email de réinitialisation vous a été envoyé.");
      this.navCtrl.pop();
    });
  }

}
