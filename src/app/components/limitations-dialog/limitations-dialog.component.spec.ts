import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitationsDialogComponent } from './limitations-dialog.component';

describe('LimitationsDialogComponent', () => {
  let component: LimitationsDialogComponent;
  let fixture: ComponentFixture<LimitationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitationsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LimitationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
