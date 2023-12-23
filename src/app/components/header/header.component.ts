import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, map, timer } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() isHeadless: boolean = false;
  toogleControl = new FormControl(this.prefersDarkMode());
  currentTime = new Date();
  currentUTCTime = new Date(
    this.currentTime.getTime() + this.currentTime.getTimezoneOffset() * 60000
  );
  subscription: Subscription = new Subscription();

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
  }

  private prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
