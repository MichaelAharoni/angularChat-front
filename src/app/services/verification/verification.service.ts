import { HttpClient } from '@angular/common/http'
import { ReturnStatement } from '@angular/compiler'
import { Injectable, isDevMode } from '@angular/core';
import { lastValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  constructor(private http:HttpClient) { }
  private URL = (isDevMode()) ? '//localhost:3030' : ''

  
  //  * Send a verification request to the server.

 async onSendVerification(phoneNum:string):Promise<any>{
  await lastValueFrom(this.http.get(`${this.URL}/api/verify/${phoneNum}`))
  }

  async onMatchVCode(vCode:string,phoneNum:string):Promise<Boolean>{
    const ans =await lastValueFrom(this.http.post(`${this.URL}/api/verify/`,{vCode,phoneNum})) as Boolean
    console.log(ans)
    return ans
  }

}
