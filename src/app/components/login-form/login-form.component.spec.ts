import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginFormComponent } from './login-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth/auth.service';
import { of } from 'rxjs';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginFormComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit output on successful login', () => {
    const authSpy = spyOn(authService, 'login');
    authSpy.and.returnValue(
      of({
        token: 'some-token',
        payload: {
          email: 'test@local.host',
          id: 'some-id',
          username: 'admin',
          roles: [],
        },
        expiresAt: Date.now(),
      })
    );
    spyOnProperty(component.form, 'valid').and.returnValue(true);
    component.loginSuccess.subscribe({
      next: (val: boolean) => {
        expect(val).toBeTruthy();
      },
      error: (err: Error) => expect(err).not.toBeDefined(),
    });

    component.onSubmit();
  });
});
