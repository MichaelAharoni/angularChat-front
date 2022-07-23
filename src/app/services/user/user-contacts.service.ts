import { ContactUser } from './../../models/interfaces';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserContactService {

  constructor(private http: HttpClient) { }

  private URL: string = (isDevMode()) ? '//localhost:3030' : ''

  async query(): Promise<ContactUser[]> {
    return await lastValueFrom(this.http.get(`${this.URL}/api/contact`)) as ContactUser[]
  }

}
