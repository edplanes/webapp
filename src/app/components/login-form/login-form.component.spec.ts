import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginFormComponent } from './login-form.component';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { IAuthInfo } from '../../models/auth.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injectable } from '@angular/core';

@Injectable()
class MockAuthService extends AuthService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override login(username: string, password: string): Observable<IAuthInfo> {
    const authInfo: IAuthInfo = {
      token: 'some-token',
      payload: {
        email: 'some@email.com',
        id: 'some-id',
      },
      expiresAt: Date.now(),
    };

    return of(authInfo);
  }
}

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginFormComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
