import { Component } from '@angular/core';
import { PilotDTO, PilotsClient } from '../../clients/pilots.client';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pilots',
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
    RouterModule,
  ],
  templateUrl: './pilots.component.html',
  styleUrl: './pilots.component.scss',
})
export class PilotsComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'averageRating',
    'aircraft',
    'pireps',
    'details',
  ];

  pilots: MatTableDataSource<PilotDTO> = new MatTableDataSource<PilotDTO>([]);

  constructor(private pilotsClient: PilotsClient) {
    pilotsClient.fetchPilots().subscribe(value => {
      this.pilots.data = value;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pilots.filter = filterValue.trim().toLowerCase();
  }
}
