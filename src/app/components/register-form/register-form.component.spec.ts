import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormComponent } from './register-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Airport } from '../../services/airports/airport.service';
import { AuthService } from '../../services/auth/auth.service';
import { of } from 'rxjs';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterFormComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert airport object to string', () => {
    const airport: Airport = {
      icao: 'EPAR',
      city: 'Bircza',
      location: {
        lat: 49.657501,
        lon: 22.514298,
        elev: 1455,
      },
      name: 'Arłamów Airport',
      score: 3,
    };

    const airportString = component.displayAirport(airport);

    expect(airportString).toContain(airport.icao);
    expect(airportString).toContain(airport.name);
  });

  it('should call auth service register method', () => {
    const authRegisterSpy = spyOn(authService, 'register').and.returnValue(
      of()
    );
    spyOnProperty(component.form, 'valid').and.returnValue(true);

    component.onSubmit();

    expect(authRegisterSpy).toHaveBeenCalledTimes(1);
  });

  it('should prevent registration call when form is invalid', () => {
    const authRegisterSpy = spyOn(authService, 'register');
    spyOnProperty(component.form, 'valid').and.returnValue(false);

    component.onSubmit();

    expect(authRegisterSpy).not.toHaveBeenCalled();
  });
});
