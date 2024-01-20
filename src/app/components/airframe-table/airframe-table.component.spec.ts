import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirframeTableComponent } from './airframe-table.component';

describe('AirframeTableComponent', () => {
  let component: AirframeTableComponent;
  let fixture: ComponentFixture<AirframeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirframeTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirframeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
