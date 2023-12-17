import { Component, HostBinding, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  toogleControl = new FormControl(true);

  ngOnInit(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('darkMode', this.toogleControl.value!);
    this.toogleControl.valueChanges.subscribe((darkMode) => {
      body.classList.toggle('darkMode', darkMode!);
    });
  }
}
