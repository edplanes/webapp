import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAirframeComponent } from './edit-airframe.component';

describe('EditAirframeComponent', () => {
  let component: EditAirframeComponent;
  let fixture: ComponentFixture<EditAirframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAirframeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAirframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
