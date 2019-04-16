import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class FcmProvider {

  apiBaseUrl = "https://fcm.googleapis.com/fcm/send";

  constructor(public http: HttpClient) {

  }


  notifPanierRecup(userId : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'key=AAAAM3ncr8M:APA91bHvYPKUDJPXW76x2uRpHyfn3pvr4_cfHIr_zAvAJIDq0Yv1Y6vwx9iLxw6ElDwGNFtHrfeQy7u1LlqEAuOEGMKTpxfGne9bMM2ehLPo5Lj07kbc24umNi3oEQPE__n57XYiy9KY',
    });
    let options = {headers: headers}
    let postData = {
      "notification":{
        "title":"Panier récupéré !",
        "body":"Votre panier a bien été enregistré comme récupéré. Merci pour votre commande !",
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
      },
        "to":"/topics/user"+userId,
        "priority":"high",
        "restricted_package_name":""
    };
    return new Promise((resolve, reject) => {
      this.http.post(this.apiBaseUrl, postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

}