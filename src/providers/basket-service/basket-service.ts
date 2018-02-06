import { Injectable } from '@angular/core';
import { Product } from '../../models/product';

@Injectable()
export class BasketServiceProvider {
  
  products: Product[];

  constructor() {
    this.products = new Array();
  }

  addProduct(product: Product) {
    const index = this.products.indexOf(product);
    
    product.quantidade = product.quantidade + 1;
    product.subTotal = this.getSubTotal(product);

    this.products[index] = product;
    
  }
  
  removeProduct(product: Product) {
    const index = this.products.indexOf(product);

    product.quantidade = product.quantidade == 0 ? 0 : product.quantidade - 1;
    product.subTotal = this.getSubTotal(product);
    
    this.products[index] = product;
  }

  getProducts(): Product[] {
    return this.products;
  }
  
  setProducts(products: Product[]) {
    this.products = products;
    console.log("1" + this.products);
  }

  getSubTotal(product: Product) {
    return product.quantidade == 0 ? 0 : product.price * product.quantidade;
  }

}
