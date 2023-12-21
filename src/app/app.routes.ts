import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './services/auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'EdPlanes - Home',
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'EdPlanes - Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'EdPlanes - Register',
  },
];
