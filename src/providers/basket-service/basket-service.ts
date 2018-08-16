import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase/app';
import { Device } from '../../models/device';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BasketServiceProvider {
  
  products: Product[];

  constructor(
    private afDatabase: AngularFireDatabase, 
    private http: HttpClient) {    
      this.products = new Array();
  }

  addProduct(product: Product) {
    const index = this.products.indexOf(product);
    
    product.amount = product.amount + 1;
    product.subTotal = this.getSubTotal(product);

    this.products[index] = product;
    
  }
  
  removeProduct(product: Product) {
    const index = this.products.indexOf(product);

    product.amount = product.amount == 0 ? 0 : product.amount - 1;
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
    return product.amount == 0 ? 0 : product.price * product.amount;
  }

  createOrder(order: Order, userId: string): Promise<any> {
    order.id = this.afDatabase.createPushId();
    return firebase.database().ref().update({                
      [`ordersByUserId/${userId}/${order.id}`] : order,
      [`ordersByDistId/${order.adress.distributorId1}/${order.id}`] : order
    })
  }

  sendPushToDistributor(order: Order, userId: string) {
    (this.afDatabase.object(`devices/${userId}`).valueChanges() as Observable<Device>).take(1)
    .subscribe(device => {      
      console.log("Token: - " + device.token)                
      this.sendPush(device.token, order);
    });
  }

  sendPush(token: string, order: Order) {
    let params = '?token=' + token;
    params += '&title=Nova compra ' + order.user.fullName;
    params += '&body=' + order.products.map(product => product.amount + "x " + product.name + "\n");
    console.log(params);
    return this.http.get('https://us-central1-disk-agua-santa-catarina.cloudfunctions.net/sendpush/' + params)
      .subscribe(
        res => {
          console.log("Sendpush - " + res.toString);
        },
        msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
      );
  }

}
