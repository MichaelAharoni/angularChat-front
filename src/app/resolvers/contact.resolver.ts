import { ContactService } from './../services/contact/contact.service';
import { UserService } from 'src/app/services/user/user.service';
import { ContactUser } from './../models/interfaces';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
} from '@angular/router';
import { lastValueFrom, pipe, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactResolver implements Resolve<ContactUser[]> {

  constructor(
    private contactService: ContactService
  ) {
  }
  async resolve(): Promise<ContactUser[]> {
    const contacts = await lastValueFrom( this.contactService.$contacts.pipe(take(1)))
    return (contacts.length) ? contacts : await this.contactService.getContactsFromNavigator()
  }
}
