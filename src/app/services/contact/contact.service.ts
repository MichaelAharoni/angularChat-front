import { UserService } from 'src/app/services/user/user.service';
import { ContactUser, NavigatorWithContacts } from '../../models/interfaces';
import { BehaviorSubject, distinctUntilChanged, take, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode, ChangeDetectorRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private userService: UserService) { }

  private _$contacts = new BehaviorSubject<ContactUser[]>([])
  public $contacts = this._$contacts.asObservable().pipe(distinctUntilChanged())

  async getContactsFromNavigator(): Promise<ContactUser[] | []> {
    const navigator: NavigatorWithContacts = window.navigator
    if ('contacts' in navigator && 'ContactsManager' in window) {
      const props = await navigator.contacts.getProperties();
      const contacts = await navigator.contacts.select(props, { multiple: true });
      const user = await lastValueFrom(this.userService.$currUser.pipe(take(1)))
      user.contacts = contacts
      await this.userService.updateUser(user)
      return contacts
    }
    else return []
  }

  addContact(contact: ContactUser) {
    this.updateContacts([...this._$contacts.value, contact])
  }

  removeContact(contact: ContactUser) {
    const updatedContacts = this._$contacts.value.filter((currContact) => currContact.phoneNum !== contact.phoneNum)
    this.updateContacts(updatedContacts)
  }

  updateContacts(contacts: ContactUser[]) {
    this._$contacts.next(contacts)
  }

  async saveContacts(): Promise<void> {
    const navigator: NavigatorWithContacts = window.navigator;
    if ('contacts' in navigator && 'ContactsManager' in window) {
      const props = await navigator.contacts.getProperties();
      const contacts = await navigator.contacts.select(props, { multiple: true });
      this._$contacts.next(contacts)
    }
  }

}
