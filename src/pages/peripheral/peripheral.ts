import { Component, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PeripheralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-peripheral',
  templateUrl: 'peripheral.html',
})
export class PeripheralPage {
  /** セントラル端末から受信したテキスト */
  pReceivedText: string = '';

  /** セントラルに返信するテキスト : デフォルト値を設定しておく */
  pResponseText: string = 'ペリフェラルから送信';

  /** 動作の進捗を示すメッセージ表示欄 : デフォルト値を設定しておく */
  message: string = '「ペリフェラル通信開始」ボタンを押してください';

  /** 「ペリフェラル通信開始」ボタン押下時の処理 */
  execPeripheral() {
    // TODO : これから実装していく
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PeripheralPage');

  }

}

/** Bluetooth 通信で使う定数クラス */
export const bluetoothConstants = {
    /** アドバタイジング名 */
    advertisingName: 'MyExampleBLE',
    /** サービス UUID */
    serviceUuid: '6E76FF78-BBE5-4804-8CB6-BC7F82C1413B\n',
    /** キャラクタリスティック UUID */
    characteristicUuid: 'ABCD'
};

@Injectable()
export class PeripheralService {

  /** ペリフェラルの初期化処理 : 通信状況が変化する度にコールバック関数が再実行される */
  initializePeripheral(successCallback: Function): Promise<any> {
    return new Promise((resolve, reject) => {
      (window as any).bluetoothle.initializePeripheral(
          (result) => {
            // コールバック関数を実行する
              successCallback(result);
              resolve(result);
              },
          (error) => { reject(error); }
          );
      });
  }
  /** サービスを追加する */
  addService(options: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      (window as any).bluetoothle.addService(
          (result) => { resolve(result); },
          (error) => { reject(error); },
          options
      );
    });
  }
   /** アドバタイジングを開始する : セントラル端末が自機を発見できるようになる */
   startAdvertising(options: Object): Promise<any> {
     return new Promise((resolve, reject) => {
       (window as any).bluetoothle.startAdvertising(
           (result) => { resolve(result); },
           (error) => { reject(error); },
           options
       );
       });
   }
   /** セントラル端末からの要求に応答する */
   respond(options: Object): Promise<any> {
     return new Promise((resolve, reject) => {
       (window as any).bluetoothle.respond(
           (result) => { resolve(result); },
           (error) => { reject(error); },
           options
       );
       });
   }
   /** アドバタイジングを終了する */
   stopAdvertising(): Promise<any> {
     return new Promise((resolve, reject) => {
       (window as any).bluetoothle.stopAdvertising(
           (result) => { resolve(result); },
           (error) => { reject(error); }
           );
       });
   }
   /** サービスを全て削除する */
   removeAllServices(): Promise<any> {
     return new Promise((resolve, reject) => {
       (window as any).bluetoothle.removeAllServices(
           (result) => { resolve(result); },
           (error) => { reject(error); }
           );
     });
   }
}