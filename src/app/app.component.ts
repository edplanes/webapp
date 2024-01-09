import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Subscription, filter, map, timer } from 'rxjs';
import { LogService } from './services/log/log.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { ElectronService } from './services/electron/electron.service';
import { LoggerService } from './services/logger/logger.service';

interface NavigationOption {
  path: string;
  displayName: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule,
    MatSidenavModule,
    MatMenuModule,
    MatDividerModule,
  ],
  providers: [LogService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  isHeadless = false;
  currentTime = new Date();
  currentUTCTime = new Date(
    this.currentTime.getTime() + this.currentTime.getTimezoneOffset() * 60000
  );
  subscription: Subscription = new Subscription();
  displayedPaths: NavigationOption[] = [];
  toogleControl = new FormControl(this.prefersDarkMode() || this.isElectron);

  get isDispatcher() {
    const roles = this.authService.authenticatedUser?.roles;
    return (
      roles &&
      (roles.includes('ADMIN') ||
        roles.includes('DISPATCHER') ||
        roles.includes('MANAGEMENT'))
    );
  }

  get currentUser() {
    return this.authService.authenticatedUser;
  }

  get isElectron() {
    return this.electron.isElectron;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private electron: ElectronService,
    private flightLogger: LoggerService
  ) {
    this.authService.isLoggedIn().subscribe(() => {
      this.displayedPaths = this.getMenuPaths();
    });
    this.flightLogger.loggerState.asObservable().subscribe(value => {
      this.displayedPaths = this.getMenuPaths();
      console.log(value);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('darkMode', this.toogleControl.value!);
    this.toogleControl.valueChanges.subscribe(darkMode => {
      body.classList.toggle('darkMode', darkMode!);
    });

    this.subscription = timer(0, 1000)
      .pipe(map(() => new Date()))
      .subscribe(time => {
        this.currentTime = time;
        this.currentUTCTime = new Date(
          time.getTime() + time.getTimezoneOffset() * 60000
        );
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(
        event =>
          (this.isHeadless = !!(<NavigationEnd>event).url.match(
            /(login|register)(?:\?returnUrl=.*)?$/
          ))
      );
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  onCloseClick() {
    this.electron.closeApp();
  }

  onMinimizeClick() {
    this.electron.minimizeWindow();
  }

  private prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private getMenuPaths(): NavigationOption[] {
    const paths: NavigationOption[] = [];
    if (!this.authService.isAuthenticated) {
      return paths;
    }

    paths.push({
      path: '/user',
      displayName: 'Dashboard',
    });

    if (this.flightLogger.isConnected) {
      paths.push({
        path: `/logger/${this.flightLogger.isConnected}`,
        displayName: 'Logger',
      });
    }

    return paths;
  }
}
