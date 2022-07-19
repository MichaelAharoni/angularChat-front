import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit , AfterContentInit,AfterViewInit } from '@angular/core';

@Component({
  selector: 'contact-picker',
  templateUrl: './contact-picker.component.html',
  styleUrls: ['./contact-picker.component.scss']
})
export class ContactPickerComponent implements OnInit,AfterViewInit {

  constructor(private cd : ChangeDetectorRef, private http : HttpClient) { }

  list! : any
  string! : string

  async ngOnInit(): Promise<void> {
    const navigator: any = window.navigator;
    if ('contacts' in navigator && 'ContactsManager' in window) {
      const props = await navigator.contacts.getProperties();
      this.list = await navigator.contacts.select(props, { multiple: true });
      this.string = 'SUCCESS !'
      this.cd.markForCheck()
    } else {
      this.string = 'Fail !'
    }
  }


  async ngAfterViewInit(): Promise<void> {
    const navigator: any = window.navigator;

    if ('contacts' in navigator && 'ContactsManager' in window) {
      const props = await navigator.contacts.getProperties();
      this.list = await navigator.contacts.select(props, { multiple: true });
      this.string = 'SUCCESS !'
      this.cd.markForCheck()
    } else {
      this.string = 'Fail !'
    }
  }



  async loadContacts() : Promise<void> {
    const navigator: any = window.navigator;

    if ('contacts' in navigator && 'ContactsManager' in window) {
      const props = await navigator.contacts.getProperties();
      this.list = await navigator.contacts.select(props, { multiple: true });
      this.string = 'SUCCESS !'
    } else {
      this.string = 'Fail !'
    }
  }
}
