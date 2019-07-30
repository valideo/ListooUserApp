import { TabsPage } from './../tabs/tabs';
import { NativeStorage } from '@ionic-native/native-storage';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
TabsPage;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confPassword: string = '';
  fName: string = '';
  sName: string = '';
  userDataFb: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiProvider: ApiProvider,
    private nativeStorage: NativeStorage
  ) {
    this.userDataFb = this.navParams.get('userData');
    if (this.userDataFb != undefined) {
      if (
        this.userDataFb['email'] != undefined &&
        this.userDataFb['email'] != null &&
        this.userDataFb['email'] != ''
      )
        this.email = this.userDataFb['email'];
      if (
        this.userDataFb['fName'] != undefined &&
        this.userDataFb['fName'] != null &&
        this.userDataFb['fName'] != ''
      )
        this.fName = this.userDataFb['fName'];
      if (
        this.userDataFb['lName'] != undefined &&
        this.userDataFb['lName'] != null &&
        this.userDataFb['lName'] != ''
      )
        this.sName = this.userDataFb['lName'];
    }
  }

  clickRegister() {
    if (
      this.email != '' &&
      this.password != '' &&
      this.sName != '' &&
      this.fName != ''
    ) {
      if (this.confPassword == this.password) this.register();
      else
        this.apiProvider.presentAlertConnexion(
          'Las constraseñas no corresponde.'
        );
    } else {
      this.apiProvider.presentToast(
        'Complete todos los campos para validar su inscripción.'
      );
    }
  }

  register() {
    this.apiProvider
      .apiRegister(this.email, this.password, this.sName, this.fName)
      .then(
        (data) => {
          this.login();
        },
        (err) => {}
      );
  }

  login() {
    this.apiProvider.apiLogin(this.email, this.password).then((data) => {
      if (data['token'] != '') {
        this.apiProvider.token = data['token'];
        this.nativeStorage
          .setItem('listooUserCredentials', {
            email: this.email,
            pass: this.password,
          })
          .then(
            () => console.log('Stored item!'),
            (error) => console.error('Error storing item', error)
          );
          this.navCtrl.pop();
      }
    });
  }
}
