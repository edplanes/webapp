import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAircraftComponent } from './edit-aircraft.component';

describe('EditAircraftComponent', () => {
  let component: EditAircraftComponent;
  let fixture: ComponentFixture<EditAircraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAircraftComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAircraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
