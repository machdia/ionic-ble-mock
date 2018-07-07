# Bluetooth Low Energy (BLE) Central Plugin
## Installing ()Ionic Native)
    $ ionic cordova plugin add cordova-plugin-ble-central
    $ npm install --save @ionic-native/ble
## Installing (Cordova)
    $ cordova plugin add cordova-plugin-bluetoothle


## Peripheral
### 最低限決めないといけない情報
- アドバタイジング名
ペリフェラル端末が周辺に自分の存在を知らせるために発信している信号のこと
- サービス UUID
- キャラクタリスティック UUID

### UUIDの生成
    $ uuidgen
