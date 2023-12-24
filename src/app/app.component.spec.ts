import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should select light mode when dark is not preferable', () => {
    const matchMediaSpy = spyOn(window, 'matchMedia');
    matchMediaSpy.and.returnValue({
      ...window.matchMedia('(prefers-color-scheme: dark)'),
      matches: false,
    });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.toogleControl.value).toBeFalsy();
  });

  it('should select dark mode if preferable', () => {
    const matchMediaSpy = spyOn(window, 'matchMedia');
    matchMediaSpy.and.returnValue({
      ...window.matchMedia('(prefers-color-scheme: dark)'),
      matches: true,
    });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.toogleControl.value).toBeTruthy();
  });
});
