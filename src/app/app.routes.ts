import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserHomeComponent } from './pages/user/user-home/user-home.component';
import { authGuard } from './services/auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Edplanes - Home',
    redirectTo: 'login',
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
];
