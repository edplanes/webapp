import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StatsCardComponent } from '../../../components/stats-card/stats-card.component';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [FlexLayoutModule, StatsCardComponent],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss',
})
export class UserHomeComponent {}
