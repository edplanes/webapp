import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Aircraft } from '../../clients/aircrafts.client';
import { LimitationsDialogComponent } from '../../components/limitations-dialog/limitations-dialog.component';
import { AircraftsService } from '../../services/aircrafts/aircrafts.service';
import { EditAircraftComponent } from '../../components/edit-aircraft/edit-aircraft.component';
@Component({
  selector: 'app-aircrafts',
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
  templateUrl: './aircrafts.component.html',
  styleUrl: './aircrafts.component.scss',
})
export class AircraftsComponent implements OnInit {
  constructor(
    private readonly aircraftService: AircraftsService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'id',
    'icao',
    'name',
    'customWeights',
    'edit',
    'delete',
  ];

  filteredAircrafts!: MatTableDataSource<Aircraft>;

  ngOnInit(): void {
    this.fetchAircraftsData();
  }

  openShowLimitations(aircraftData: Aircraft) {
    this.dialog.open(LimitationsDialogComponent, {
      data: aircraftData.customWeights,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredAircrafts.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditAircraftComponent);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) return;

      this.fetchAircraftsData();
    });
  }

  openEditDialog(aircraft: Aircraft) {
    const dialogRef = this.dialog.open(EditAircraftComponent, {
      data: aircraft,
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) return;

      this.fetchAircraftsData();
    });
  }

  deleteAircraft(id: string) {
    return this.aircraftService.deleteAircraft(id).subscribe(() => {
      this.fetchAircraftsData();
    });
  }

  fetchAircraftsData() {
    this.aircraftService.searchAircraft().subscribe((aircraft: Aircraft[]) => {
      this.filteredAircrafts = new MatTableDataSource(aircraft);
    });
  }
}
