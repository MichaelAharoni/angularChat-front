import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class BarcodeServiceService {

  constructor(private http: HttpClient, private jwt: JwtService) { }

  getBarcodeId() {
    const barcodeId = this.jwt.getToken() || this.generateAndsaveId()
    return barcodeId
  }
  generateBarcode(barcodeId: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${barcodeId}`

  }

  generateAndsaveId() {
    const barcodeId = this.makeId(10)
    this.jwt.saveToken(barcodeId)
    return barcodeId
  }
  makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
  }
}
