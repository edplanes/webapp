import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewRouteComponent } from './add-new-route.component';

describe('AddNewRouteComponent', () => {
  let component: AddNewRouteComponent;
  let fixture: ComponentFixture<AddNewRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewRouteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
