import { Component, Injectable, ChangeDetectorRef } from '@angular/core';
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
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams

  ) {}
  /** セントラル端末から受信したテキスト */
  pReceivedText: string = '';

  /** セントラルに返信するテキスト : デフォルト値を設定しておく */
  pResponseText: string = 'ペリフェラルから送信';

  /** 動作の進捗を示すメッセージ表示欄 : デフォルト値を設定しておく */
  message: string = '「ペリフェラル通信開始」ボタンを押してください';
    private changeDetectorRef: ChangeDetectorRef;
    private peripheralService: PeripheralService;
    private bluetoothService: BluetoothService;

  /** 「ペリフェラル通信開始」ボタン押下時の処理 */
  execPeripheral() {
      this.updateMessage('ペリフェラル通信開始');

      let waitTimer;

      this.peripheralService.initializePeripheral((result) => {
        //read https://github.com/randdusing/cordova-plugin-bluetoothle#success-35
        if(result.status === 'writeRequested') {
          this.updateMessage('write 要求を受信しました');
          this.pReceivedText = this.bluetoothService.decodeText(result.value);
        } else if(result.status === 'readRequested') {
          this.updateMessage('read 要求を受信しました');
              // 処理中断用のタイマーを解除する
            if(waitTimer) {
              clearTimeout(waitTimer);
            }
            this.peripheralService.respond({
                requestId: result.requestId,
                value: this.bluetoothService.encodeText(this.pReceivedText)
            }).then(() => {
              this.destroyPeripheral();
            }).catch(() => {
              this.destroyPeripheral();
            });
        }
        else {
          this.updateMessage(`次のイベントが発生しました : ${result.status}`);
        }
        this.changeDetectorRef.detectChanges();
      }).then(() => {
        this.updateMessage('ペリフェラル初期化完了・サービス追加開始');
        return this.peripheralService.addService({
            service: bluetoothConstants.serviceUuid,
            characteristics:[{
                uuid: bluetoothConstants.characteristicUuid,
                permissions: {
                  read: true,
                  write: true
                },
                properties: {
                  read: true,
                  writeWithoutResponse: true,
                  write: true,
                  notify: true,
                  indicate: true
                }
            }]
        });
      }).then(() => {
        this.updateMessage('サービス追加完了・アドバタイジング開始');
        return this.peripheralService.startAdvertising( {
            services: [bluetoothConstants.serviceUuid], //for iOS
            service: bluetoothConstants.serviceUuid, //for android
            name: bluetoothConstants.advertisingName
        } );
      }).then(() => {
        this.updateMessage('アドバタイジング開始・セントラル端末の通信待機中…');
        /*waitTimer - setTimeout(() => {
          this.updateMessage('10秒間応答がなかったため中断します');
          this.destroyPeripheral();
          }, 10 * 1000);*/
      }).catch((error) => {
        this.updateMessage(`ペリフェラル通信開始処理に失敗しました : ${error}`);
      });
  }
  private updateMessage(message: string) {
    this.message = message;
    this.changeDetectorRef.detectChanges();
  }
  private destroyPeripheral() {
    this.updateMessage('終了処理開始 : アドバタイジング終了');
    this.peripheralService.stopAdvertising()
        .then(() => {
          this.updateMessage('アドバタイジング終了完了・サービス終了開始');
          return this.peripheralService.removeAllServices();
          })
        .then(() => {
          // 全て正常終了
            this.updateMessage('サービス終了完了・ペリフェラル通信の終了処理が完了');
        })
        .catch((error) => {
          // どこかの処理で失敗したらエラーメッセージを表示
            this.updateMessage(`ペリフェラル通信終了処理に失敗しました : ${error}`);
        });
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
@Injectable()
export class BluetoothService {
  constructor(
      public windowRefService: WindowRefService
  ){}
  encodeText(str: string): string {
    const encodedString = btoa(this.windowRefService.nativeWindow.unescape(encodeURIComponent(str)));
    return encodedString;
  }
  decodeText(encodedString: string): string {
    const str = decodeURIComponent(this.windowRefService.nativeWindow.escape(atob(encodedString)));
    return str;
  }
}
@Injectable()
export class WindowRefService {
    get nativeWindow(): any {
        return _window();
    }
}
function _window(): any {
    return window;
}