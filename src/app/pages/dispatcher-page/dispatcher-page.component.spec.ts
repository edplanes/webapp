import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherPageComponent } from './dispatcher-page.component';

describe('DispatcherPageComponent', () => {
  let component: DispatcherPageComponent;
  let fixture: ComponentFixture<DispatcherPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatcherPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatcherPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
