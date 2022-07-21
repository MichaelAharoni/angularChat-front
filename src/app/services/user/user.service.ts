import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private currentUserSubject = new BehaviorSubject<User>({} as User);
    // public $currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  constructor() { }
}
