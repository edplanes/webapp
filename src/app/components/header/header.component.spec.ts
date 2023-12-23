import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select light mode when dark is not preferable', () => {
    const matchMediaSpy = spyOn(window, 'matchMedia');
    matchMediaSpy.and.returnValue({
      ...window.matchMedia('(prefers-color-scheme: dark)'),
      matches: false,
    });

    expect(component.toogleControl.value).toBeFalsy();
  });

  it('should select dark mode if preferable', () => {
    const matchMediaSpy = spyOn(window, 'matchMedia');
    matchMediaSpy.and.returnValue({
      ...window.matchMedia('(prefers-color-scheme: dark)'),
      matches: true,
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.toogleControl.value).toBeTruthy();
  });
});
