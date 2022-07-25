import { ContactUser } from './../../models/interfaces';
import { lastValueFrom, BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserContactService {

  constructor(private http: HttpClient) { }

  private URL: string = (isDevMode()) ? '//localhost:3030' : ''

  private _$contacts = new BehaviorSubject<ContactUser[]>([])
  public $contacts = this._$contacts.asObservable().pipe(distinctUntilChanged())

  async query(): Promise<void> {
    const contacts = await lastValueFrom(this.http.get(`${this.URL}/api/contact`, { withCredentials: true })) as ContactUser[]
    this._$contacts.next(contacts)
  }
}
