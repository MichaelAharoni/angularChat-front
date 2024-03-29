import { UserService } from 'src/app/services/user/user.service';
import { ContactUser } from './../models/interfaces';
import { lastValueFrom } from 'rxjs';
import { ContactService } from '../services/contact/contact.service'
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {

  contacts!: ContactUser[]

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private contactService: ContactService,
    private userService: UserService
  ) { }
  title = 'angularChat';
  isMobileDevice: boolean = window.screen.width < 600

  async ngOnInit(): Promise<void> {
    await this.userService.login()
    this.userService.$currUser.subscribe(({ contacts }) => {
      this.contactService.updateContacts(contacts)
    })
  }

  makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
  }
}
