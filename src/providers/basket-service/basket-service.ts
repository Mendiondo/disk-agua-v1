import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Product } from '../../models/product';

@Injectable()
export class BasketServiceProvider {
  
  products: Product[];

  constructor() {
    this.products = new Array();
  }

  addProduct(product: Product) {    
    this.products.push(product);    
  }
  
  removeProduct(product: Product) {        
    const index = this.products.indexOf(product);
    this.products.splice(index, 1);    
  }

  getProducts(): Product[] {
    return this.products;
  }

}
