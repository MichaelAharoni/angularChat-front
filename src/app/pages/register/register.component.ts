import { Router } from '@angular/router'
import { Component, ElementRef, OnInit } from '@angular/core'
import { User } from 'src/app/models/classes'
import { UserService } from 'src/app/services/user/user.service'
import { VerificationService } from 'src/app/services/verification/verification.service'
import { FocusDirective } from 'src/app/directives/focus.directive'

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
    private verifyService: VerificationService,
  ) { }
  phoneNum: string = ''
  userName: string = ''
  vCode: string = ''
  codeLength = ['', '', '', '', '', '']
  isCodeReady: boolean = false
  ngOnInit(): void {
    // this .user = this.userService.getEmptyUser()

  }
  /* 
  ***************************************************
  this functions are for verification purposes  only
  ***************************************************
  */

  async onSendVerificationCode() {
    const regex = new RegExp(/^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/g)
    // const regex = new RegExp(/^[0][5][0|2|3|4|5|9]{1}[-]{0,1}[0-9]{7}$/g)
    console.log('0544699908')
    console.log(this.phoneNum)
    if (regex.test(this.phoneNum)) {
      await this.verifyService.onSendVerification(this.phoneNum)
      this.isCodeReady = true
    }
  }

  async onSumbitVCode() {
    this.vCode = this.codeLength.join('')
    if (this.vCode.length !== 6) return
    const isMatch = await this.verifyService.onMatchVCode(this.vCode, this.phoneNum)
    if (isMatch) this.onSaveUser()
    else console.log('no match!!')

  }

  async onSaveUser() {
    const newUser = new User(this.userName, this.phoneNum)
    await this.userService.register(newUser)
    this.router.navigateByUrl('/')
    // bring empty user with this data
  }

  /* 
  ***************************************************
  this functions are for the input events
  ***************************************************
  */
  onInputNumber(ev: Event): void {

    const target = ev.target as HTMLInputElement

    if (isNaN(+(target.value!))) {
      target.value = ''
      const idx = +target.dataset['idx']!
      this.codeLength[idx] = ''
    } else {
      if (target.nextElementSibling?.nodeName === 'BUTTON') return
      (target.nextElementSibling as HTMLInputElement)?.focus()
    }

  }

  onBackSpace(ev : Event) {
    const target = ev.target as HTMLInputElement
    const prevElemnt = target.previousElementSibling as HTMLInputElement
    const idx: number = (target.value) ? +target.dataset['idx']! : +prevElemnt.dataset['idx']!
    if (isNaN(idx)) return
    if (target.value) {
      target.value = ''
    } else {
      prevElemnt.focus()
      prevElemnt.value = ''
    }
    this.codeLength[idx] = ''
  }

  generateKey(idx: number) {
    return idx
  }

}
