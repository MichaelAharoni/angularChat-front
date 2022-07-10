import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'angularChat';
  isMobileDevice : boolean = true
  // isMobileDevice : boolean = window.screen.width < 600
}
