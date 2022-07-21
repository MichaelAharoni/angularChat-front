import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor() { }
  phoneNumber!: number
  userName!:string
  ngOnInit(): void {
    // check if user logged in

  }
  onSaveUser(){
    // bring empty user with this data
  }

}
