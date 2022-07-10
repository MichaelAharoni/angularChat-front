import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private route : ActivatedRoute){}
  title = 'angularChat';
  isMobileDevice : boolean = window.screen.width < 600
  
  ngOnInit(): void {
    this.route.params.subscribe((params)=>console.log(params))
  }
  // isMobileDevice : boolean = true
}
