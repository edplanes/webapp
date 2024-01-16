import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Flight } from '../../clients/flights.client';
import { FlightsService } from '../../services/flights/flights.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { LoggerService } from '../../services/logger/logger.service';
import { Router } from '@angular/router';
import { ElectronService } from '../../services/electron/electron.service';

@Component({
  selector: 'app-flights-table',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    DatePipe,
  ],
  templateUrl: './flights-table.component.html',
  styleUrl: './flights-table.component.scss',
})
export class FlightsTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'callsign',
    'departure',
    'departureTime',
    'arrival',
    'arrivalTime',
    'aircraft',
    'typeCode',
    'duration',
    'rating',
    'status',
    'showLog',
    'cancel',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() flights: Flight[] = [];
  datasource: MatTableDataSource<Flight> = new MatTableDataSource<
    Flight,
    MatPaginator
  >([]);

  constructor(
    private flightsService: FlightsService,
    private cancelConfirmDialog: MatDialog,
    private startConfirmDialog: MatDialog,
    private flightLogger: LoggerService,
    private router: Router,
    private electronService: ElectronService
  ) {}

  ngOnInit(): void {
    if (
      this.electronService.isElectron &&
      !this.displayedColumns.includes('start')
    )
      this.displayedColumns.push('start');
    this.datasource.data = this.flights;
  }

  cancelFlight(flightId: string) {
    const dialogRef = this.cancelConfirmDialog.open(MessageDialogComponent, {
      autoFocus: true,
      data: {
        message: 'Are you sure want to cancel flight?',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      result &&
        this.flightsService.cancelFlight(flightId).subscribe(() => {
          this.flightsService.fetchFlights().subscribe(flights => {
            this.flights = flights;
            this.ngOnInit();
          });
        });
    });
  }

  startFlight(id: string) {
    const dialogRef = this.startConfirmDialog.open(MessageDialogComponent, {
      autoFocus: true,
      data: {
        message: `This will immediately initialize a connection with flight simulator and reporting service. Continue?`,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.flightLogger.startFlight(id);
      this.router.navigateByUrl(`logger/${id}`);
    });
  }

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }
}
