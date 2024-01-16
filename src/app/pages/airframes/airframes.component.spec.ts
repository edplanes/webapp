import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirframesComponent } from './airframes.component';

describe('AirframesComponent', () => {
  let component: AirframesComponent;
  let fixture: ComponentFixture<AirframesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirframesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirframesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
