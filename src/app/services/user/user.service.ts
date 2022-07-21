import { HttpClient } from '@angular/common/http'
import { Injectable, isDevMode } from '@angular/core'
import { BehaviorSubject, distinctUntilChanged, lastValueFrom, Observable } from 'rxjs'
import { User } from 'src/app/models/classes'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public $currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private URL = (isDevMode()) ? '//localhost:3030' : ''

  async getUserByPhoneNumber(phoneNum: string): Promise<User> {
    return await lastValueFrom(this.http.get(`${this.URL}/api/user/${phoneNum}`)) as User
  }


}
