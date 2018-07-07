import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BLE} from '@ionic-native/ble';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private ble: BLE, private plt: Platform) {
      // 1. 利用可能になったかをチェックする
      this.plt.ready().then((readySource) => {
          // 2. 接続対象のデバイスをスキャンする
          this.ble.scan([], 5).subscribe(device => {
              // 3. 対象のデバイスに接続する
              this.ble.connect(device["id"]).subscribe(data=>{

              });
          });
      });
  }

}
