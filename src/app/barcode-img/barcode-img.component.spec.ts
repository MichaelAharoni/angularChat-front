import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeImgComponent } from './barcode-img.component';

describe('BarcodeImgComponent', () => {
  let component: BarcodeImgComponent;
  let fixture: ComponentFixture<BarcodeImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
