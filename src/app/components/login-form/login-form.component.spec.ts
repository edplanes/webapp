import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginFormComponent } from './login-form.component';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { IAuthInfo } from '../../models/auth.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';

class MockAuthService extends AuthService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override login(username: string, password: string): Observable<object> {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpClient: HttpClient;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpTestingController: HttpTestingController;

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

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
