import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {WindowRefService} from "../../pages/peripheral/peripheral";

@Injectable()
export class BluetoothServiceProvider {

    constructor(public http: HttpClient,
                public windowRefService: WindowRefService) {
        console.log('Hello BluetoothServiceProvider Provider');
    }

    encodeText(str: string): string {
        const encodedString = btoa(this.windowRefService.nativeWindow.unescape(encodeURIComponent(str)));
        return encodedString;
    }

    decodeText(encodedString: string): string {
        const str = decodeURIComponent(this.windowRefService.nativeWindow.escape(atob(encodedString)));
        return str;
    }

}
