import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Airframe } from '../../clients/aircrafts.client';
import { LimitationsDialogComponent } from '../../components/limitations-dialog/limitations-dialog.component';
import { AircraftsService } from '../../services/aircrafts/aircrafts.service';
import { DefaultsDialogComponent } from '../../components/defautls-dialog/defaults-dialog.component';
import { EditAirframeComponent } from '../../components/edit-airframe/edit-airframe.component';

@Component({
  selector: 'app-airframes',
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
  templateUrl: './airframes.component.html',
  styleUrl: './airframes.component.scss',
})
export class AirframesComponent implements OnInit {
  constructor(
    private readonly aircraftService: AircraftsService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'id',
    'icao',
    'name',
    'purpose',
    'category',
    'size',
    'limitations',
    'defaults',
    'edit',
    'delete',
  ];

  filteredAirframes!: MatTableDataSource<Airframe>;

  ngOnInit(): void {
    this.fetchAirframeData();
  }

  openShowLimitations(aircraftData: Airframe) {
    this.dialog.open(LimitationsDialogComponent, {
      data: aircraftData.limitations,
    });
  }

  openShowDefaults(aircraftData: Airframe) {
    console.log(aircraftData);
    this.dialog.open(DefaultsDialogComponent, {
      data: aircraftData.defaults,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredAirframes.filter = filterValue.trim().toLowerCase();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EditAirframeComponent);
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) return;

      this.fetchAirframeData();
    });
  }

  openEditDialog(airframe: Airframe) {
    const dialogRef = this.dialog.open(EditAirframeComponent, {
      data: airframe,
    });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) return;

      this.fetchAirframeData();
    });
  }

  deleteAirframe(id: string) {
    return this.aircraftService.deleteAirframe(id).subscribe(() => {
      this.fetchAirframeData();
    });
  }

  fetchAirframeData() {
    this.aircraftService.searchAirframe().subscribe((aircraft: Airframe[]) => {
      this.filteredAirframes = new MatTableDataSource(aircraft);
    });
  }
}
