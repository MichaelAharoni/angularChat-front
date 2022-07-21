import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): string {
    // return  JSON.parse(window.localStorage.getItem('jwtToken')||'') 
    return window.localStorage['jwtToken'] || null
  }

  saveToken(token: string) {
    window.localStorage['jwtToken'] = token;
    // window.localStorage.setItem('jwtToken',token)
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }
}