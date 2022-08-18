import { ContactService } from './../services/contact/contact.service';
import { ContactUser } from './../models/interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactList implements OnInit {

  constructor(private contactService: ContactService) { }
  contacts!: ContactUser[]

  ngOnInit(): void {
    this.contactService.$contacts
    .subscribe(contacts => this.contacts = contacts)
  }

  generateKey(idx:number){
    return idx
  }
}
