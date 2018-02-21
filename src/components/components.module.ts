import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdressSearchFieldComponent } from './adress-search-field/adress-search-field';
@NgModule({
	declarations: [AdressSearchFieldComponent],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	imports: [],
	exports: [AdressSearchFieldComponent]
})
export class ComponentsModule {}
