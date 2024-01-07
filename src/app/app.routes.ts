import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserHomeComponent } from './pages/user/user-home/user-home.component';
import { DispatcherPageComponent } from './pages/dispatcher-page/dispatcher-page.component';
import { authGuard } from './services/auth/auth.service';
import { LoggerComponent } from './pages/logger/logger.component';
import { electronGuard } from './services/electron/electron.service';

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
  },
];
