import { NgModule } from '@angular/core';
import { HeaderSmallComponent } from './header-small/header-small';
import { HeaderBigComponent } from './header-big/header-big';
@NgModule({
	declarations: [HeaderSmallComponent,
    HeaderBigComponent],
	imports: [],
	exports: [HeaderSmallComponent,
    HeaderBigComponent]
})
export class ComponentsModule {}
