import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { JwtService } from '../jwt/jwt.service'

@Injectable({
  providedIn: 'root'
})
export class QrServiceService {

  constructor(private http: HttpClient, private jwt: JwtService) { }

  getQrId() {
    const qrId = this.jwt.getToken() || this.generateAndsaveId()
    return qrId
  }
  generateQr(qrId: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrId}`

  }

  generateAndsaveId() {
    const qrId = this.makeId(10)
    this.jwt.saveToken(qrId)
    return qrId
  }
  makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0;i < length;i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
  }
}
