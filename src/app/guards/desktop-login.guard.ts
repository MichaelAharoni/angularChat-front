import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/classes';
import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesktopLoginGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> | boolean {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.userService.getCurrUser() || {}
        if (!user?.phoneNum) {
          // const cmpUrl = (window.outerWidth < 550) ? 'register' : 'qr'
          let cmpUrl = (window.outerWidth < 550) ? 'register' : 'qr'
          // if (isDevMode()) cmpUrl = 'register'
          this.router.navigateByUrl(cmpUrl)
        }
        else resolve(true)
      }, 400);
    })
  }
}
