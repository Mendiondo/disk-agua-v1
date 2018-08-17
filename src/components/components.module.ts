import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdressSearchFieldComponent } from './adress-search-field/adress-search-field';
import { MenuComponent } from './menu/menu';
@NgModule({
	declarations: [AdressSearchFieldComponent,
    MenuComponent],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	imports: [],
	exports: [AdressSearchFieldComponent,
    MenuComponent]
})
export class ComponentsModule {}
