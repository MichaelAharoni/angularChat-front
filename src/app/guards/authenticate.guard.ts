import { UserService } from 'src/app/services/user/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  isLoggedIn: boolean = false
  checkIntervalId!: number

  canActivate(): Promise<boolean> {
    this.userService.$currUser.subscribe((user) => this.isLoggedIn = !!Object.keys(user || {}).length)
    return new Promise((resolve) => {
      // const maxTimePass: number = Date.now() + 1000
      const maxTimePass: number = Date.now() + 10000 // Temproary
      if (!this.isLoggedIn) {
        this.checkIntervalId = window.setInterval(() => {
          if (this.isLoggedIn) {
            window.clearInterval(this.checkIntervalId)
            resolve(true)
          } else if (Date.now() > maxTimePass) {
            window.clearInterval(this.checkIntervalId)
            const cmpUrl = (window.outerWidth < 550) ? 'register' : 'register'
            // const cmpUrl = (window.outerWidth < 550) ? 'register' : 'qr'
            this.router.navigateByUrl(cmpUrl)
          }
        }, 10)
      }
      else resolve(true)
    })
  }
}
