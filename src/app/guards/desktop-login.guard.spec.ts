import { TestBed } from '@angular/core/testing';

import { DesktopLoginGuard } from './desktop-login.guard';

describe('DesktopLoginGuard', () => {
  let guard: DesktopLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DesktopLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
