import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private route : ActivatedRoute,private socketService : SocketService){}
  title = 'angularChat';
  isMobileDevice : boolean = window.screen.width < 600
  
  ngOnInit(): void {
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
