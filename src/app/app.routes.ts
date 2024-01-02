import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserHomeComponent } from './pages/user/user-home/user-home.component';
import { DispatcherPageComponent } from './pages/dispatcher-page/dispatcher-page.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './services/auth/auth.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Edplanes - Home',
    component: HomeComponent,
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
    path: 'dispatcher',
    component: DispatcherPageComponent,
  },
];
