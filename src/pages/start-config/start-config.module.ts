import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartConfigPage } from './start-config';

@NgModule({
  declarations: [
    StartConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(StartConfigPage),
  ],
})
export class StartConfigPageModule {}
