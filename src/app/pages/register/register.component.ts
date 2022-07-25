import { Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/models/classes'
import { UserService } from 'src/app/services/user/user.service'
import { VerificationService } from 'src/app/services/verification/verification.service'

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
    private verifyService: VerificationService
  ) { }
  phoneNum: string = ''
  userName: string = ''
  vCode: string = ''
  isCodeReady: boolean = false
  ngOnInit(): void {
    // this .user = this.userService.getEmptyUser()

  }

  async onSendVerificationCode() {
    await this.verifyService.onSendVerification(this.phoneNum)
    this.isCodeReady = true
  }
  async onSumbitVCode() {
    const isMatch = await this.verifyService.onMatchVCode(this.vCode,this.phoneNum)
    if(isMatch) this.onSaveUser()
    else console.log('nope!')

  }
  async onSaveUser() {
    const newUser = new User(this.userName, this.phoneNum)
    await this.userService.register(newUser)
    this.router.navigateByUrl('/')
    // bring empty user with this data
  }

}
