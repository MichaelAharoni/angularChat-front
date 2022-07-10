import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'angularChat';
<<<<<<< HEAD
  isMobileDevice : boolean = true
  // isMobileDevice : boolean = window.screen.width < 600
=======
  isMobileDevice : boolean = window.screen.width < 600
  // isMobileDevice : boolean = true
>>>>>>> b0974bfcb966cf68f9d9b6735f647050e1b98797
}
