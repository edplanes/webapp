import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserHomeComponent } from './pages/user/user-home/user-home.component';
import { DispatcherPageComponent } from './pages/dispatcher-page/dispatcher-page.component';
import { authGuard } from './services/auth/auth.service';
import { LoggerComponent } from './pages/logger/logger.component';
import { electronGuard } from './services/electron/electron.service';
import { MyFlightsComponent } from './pages/my-flights/my-flights.component';
import { RoutesComponent } from './pages/routes/routes.component';
import { AircraftsComponent } from './pages/aircrafts/aircrafts.component';
import { PilotsComponent } from './pages/pilots/pilots.component';
import { AirframesComponent } from './pages/airframes/airframes.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Edplanes - Home',
    redirectTo: 'user',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Edplanes - Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Edplanes - Register',
  },
  {
    path: 'flights/my',
    component: MyFlightsComponent,
    title: 'Edplanes - My Flights',
    canActivate: [authGuard],
  },
  {
    path: 'user',
    component: UserHomeComponent,
    title: 'Edplanes - Home',
    canActivate: [authGuard],
  },
  {
    path: 'logger/:id',
    component: LoggerComponent,
    canActivate: [authGuard, electronGuard],
  },
  {
    path: 'dispatcher',
    component: DispatcherPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'routes',
    component: RoutesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'aircrafts',
    component: AircraftsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'pilots',
    component: PilotsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'airframes',
    component: AirframesComponent,
    canActivate: [authGuard],
  },
];
