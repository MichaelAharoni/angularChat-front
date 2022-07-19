import { TestBed } from '@angular/core/testing';

import { UserContactsService } from './user-contacts.service';

describe('UserContactsService', () => {
  let service: UserContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
