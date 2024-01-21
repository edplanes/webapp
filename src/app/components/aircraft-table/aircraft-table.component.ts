import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AircraftsService } from '../../services/aircrafts/aircrafts.service';
import { Aircraft, Airframe } from '../../clients/aircrafts.client';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-aircraft-table',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
  ],
  templateUrl: './aircraft-table.component.html',
  styleUrl: './aircraft-table.component.scss',
})
export class AircraftTableComponent {
  constructor(private readonly aircraftService: AircraftsService) {}

  displayedColumns: string[] = ['id', 'icao', 'customWeights'];

  filteredAircraft!: MatTableDataSource<Aircraft>;

  ngOnInit(): void {
    this.fetchAircraftData();
  }

  // openLimitationsModal(data) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredAircraft.filter = filterValue.trim().toLowerCase();
  }

  fetchAircraftData() {
    this.aircraftService.searchAircraft().subscribe((aircraft: Aircraft[]) => {
      this.filteredAircraft = new MatTableDataSource(aircraft);
    });
  }
}
