import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/models/classes'
import { UserService } from 'src/app/services/user/user.service'

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService) { }
  phoneNum: string = ''
  userName: string = ''

  ngOnInit(): void {
    // this .user = this.userService.getEmptyUser()

  }
  onSaveUser() {

    const newUser = new User(this.userName, this.phoneNum)
    // bring empty user with this data
  }

}
