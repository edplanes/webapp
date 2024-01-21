import { Component, Inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AircraftsService } from '../../services/aircrafts/aircrafts.service';
import { Airframe } from '../../clients/aircrafts.client';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { LimitationsDialogComponent } from '../limitations-dialog/limitations-dialog.component';

@Component({
  selector: 'app-airframe-table',
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
  templateUrl: './airframe-table.component.html',
  styleUrl: './airframe-table.component.scss',
})
export class AirframeTableComponent implements OnInit {
  constructor(
    private readonly aircraftService: AircraftsService,
    private dialogRef: MatDialogRef<AirframeTableComponent>,
    private showLimitationsDialog: MatDialog
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
  ];

  filteredAirframes!: MatTableDataSource<Airframe>;

  ngOnInit(): void {
    this.fetchAirframeData();
  }

  openShowLimitations(aircraftData: any) {
    const dialogRef = this.showLimitationsDialog.open(
      LimitationsDialogComponent,
      {
        data: { aircraftData: aircraftData },
      }
    );
    dialogRef.afterClosed().subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredAirframes.filter = filterValue.trim().toLowerCase();
  }

  fetchAirframeData() {
    this.aircraftService.searchAirframe().subscribe((aircraft: Airframe[]) => {
      this.filteredAirframes = new MatTableDataSource(aircraft);
    });
  }
}
