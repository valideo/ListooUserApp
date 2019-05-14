import { NgModule } from '@angular/core';
import { HeaderSmallComponent } from './header-small/header-small';
import { HeaderBigComponent } from './header-big/header-big';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [HeaderSmallComponent,
    HeaderBigComponent],
	imports: [IonicModule.forRoot(ComponentsModule)],
	exports: [HeaderSmallComponent,
    HeaderBigComponent]
})
export class ComponentsModule {}
