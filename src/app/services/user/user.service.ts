import { HttpClient } from '@angular/common/http'
import { Injectable, isDevMode } from '@angular/core'
import { BehaviorSubject, distinctUntilChanged, lastValueFrom, Observable } from 'rxjs'
import { User } from 'src/app/models/classes'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  private _$currUser = new BehaviorSubject<User>({} as User);
  public $currUser = this._$currUser.asObservable().pipe(distinctUntilChanged());

  private URL = (isDevMode()) ? '//localhost:3030' : ''

  getCurrUser(){
    return this._$currUser.value
  }

  async getUserByPhoneNumber(credantials: string): Promise<User> {
    return await lastValueFrom(this.http.get(`${this.URL}/api/user/${credantials}`)) as User
  }

  async register(user: User): Promise<User> {
    const currUser = await lastValueFrom(this.http.post(`${this.URL}/api/auth/authenticate`,user,{withCredentials:true})) as User
    this._$currUser.next(currUser)
    return currUser
  }
  
  async login(credantials:{phoneNum:string} = {phoneNum:''}): Promise<void> {
    const currUser = await lastValueFrom(this.http.post(`${this.URL}/api/auth/authenticate`,credantials,{withCredentials:true})) as User
    this._$currUser.next(currUser)
  }
}
