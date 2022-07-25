import { User } from '../../models/classes';
import { UserService } from 'src/app/services/user/user.service';
import { UserContactService } from '../../services/user-contacts/user-contacts.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  currUser!: User

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private userContactService: UserContactService,
    private userService: UserService
  ) { }
  title = 'angularChat';
  isMobileDevice: boolean = window.screen.width < 600

  async ngOnInit(): Promise<void> {
    this.userService.$currUser.subscribe(user=>this.currUser = user)
    // this.route.params.subscribe((params)=>console.log(params))
  }
}
