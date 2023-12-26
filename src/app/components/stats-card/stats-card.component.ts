import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StatisticsService } from '../../services/statistics/statistics.service';
import { AuthService } from '../../services/auth/auth.service';
import { StatisticsDTO } from '../../clients/stats.client';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    FlexLayoutModule,
    MatGridListModule,
  ],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
})
export class StatsCardComponent {
  statistics: StatisticsDTO | undefined;

  constructor(
    private statisticsService: StatisticsService,
    private authService: AuthService
  ) {
    if (authService.authenticatedUser) {
      statisticsService
        .getUserStatistics(authService.authenticatedUser.id)
        .subscribe({
          next: stats => (this.statistics = stats),
        });
    }
  }

  get currentLocation() {
    const location = this.statistics?.currentLocation;
    return location
      ? `${location.icao.toUpperCase()}${
          location.iata && `/${location.iata.toUpperCase()}`
        }`
      : 'Not Available';
  }

  get averagePoints() {
    return (
      (this.statistics &&
        this.statistics.pilotReportsCount > 0 &&
        Math.floor(
          this.statistics.earnedPoints / this.statistics.pilotReportsCount
        )) ||
      0
    );
  }

  get inFlightTime() {
    const totalSeconds = this.statistics?.inFlightSeconds || 0;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes - hours * 60;
    const seconds = totalSeconds - totalMinutes * 60;

    return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(
      seconds
    )}`;
  }

  private padTime(time: number) {
    return String(time).padStart(2, '0');
  }
}
