import { ContactUser } from './../models/interfaces';
import { lastValueFrom } from 'rxjs';
import { UserContactService } from '../services/user-contacts/user-contacts.service'
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {

  contacts! : Promise<ContactUser[]>

  constructor(private route : ActivatedRoute,private socketService : SocketService,private userContactService : UserContactService){}
  title = 'angularChat';
  isMobileDevice : boolean = window.screen.width < 600
  
  ngOnInit(): void {
    this.contacts = this.userContactService.query()
    // this.route.params.subscribe((params)=>console.log(params))
  }

  makeId(length = 6) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
  }
  // isMobileDevice : boolean = true
}
