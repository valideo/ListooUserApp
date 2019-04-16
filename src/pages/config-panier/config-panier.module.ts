import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigPanierPage } from './config-panier';

@NgModule({
  declarations: [
    ConfigPanierPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigPanierPage),
  ],
})
export class ConfigPanierPageModule {}
