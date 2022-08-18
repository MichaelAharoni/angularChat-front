import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPreview } from './contact-preview.component';

describe('ContactPreview', () => {
  let component: ContactPreview;
  let fixture: ComponentFixture<ContactPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactPreview ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
