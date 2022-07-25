import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/models/classes'
import { UserService } from 'src/app/services/user/user.service'

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router:Router
    ) { }
  phoneNum: string = ''
  userName: string = ''

  ngOnInit(): void {
    // this .user = this.userService.getEmptyUser()

  }
  async onSaveUser() {
    const newUser = new User(this.userName, this.phoneNum)
    await this.userService.register(newUser)
    this.router.navigateByUrl('/')
    // bring empty user with this data
  }

}
