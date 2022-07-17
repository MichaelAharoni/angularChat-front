import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrImgComponent } from './qr-img.component';

describe('QrImgComponent', () => {
  let component: QrImgComponent;
  let fixture: ComponentFixture<QrImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
