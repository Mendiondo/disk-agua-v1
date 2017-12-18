import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})
export class AddProductPage {
  currentNumber: number = 0;
  currentNumber1: number = 0;
  currentNumber2: number = 0;  
  currentNumber3: number = 0;  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProductPage');
  }

  increment() {
    this.currentNumber = this.currentNumber +1;
  }

  decrement() {
    if (this.currentNumber == 0) 
      this.currentNumber = 0;  
    else 
      this.currentNumber = this.currentNumber -1;
  }

}
