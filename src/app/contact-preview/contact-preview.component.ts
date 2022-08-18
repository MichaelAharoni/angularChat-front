import { ContactUser } from './../models/interfaces';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'contact-preview',
  templateUrl: './contact-preview.component.html',
  styleUrls: ['./contact-preview.component.scss']
})
export class ContactPreview implements OnInit {
@Input() contact! : ContactUser
  constructor() { }

  ngOnInit(): void {
  }

  onPreviewClick():void {
    console.log('clicked on '+this.contact.userName)
  }

}
