import { Route, RoutesClient } from './../../clients/routes.client';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddNewRouteComponent } from '../../components/add-new-route/add-new-route.component';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss',
})
export class RoutesComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'callsign',
    'allowedAircrafts',
    'duration',
    'departure',
    'arrival',
    'edit',
    'delete',
  ];

  datasource: MatTableDataSource<Route> = new MatTableDataSource<Route>([]);

  constructor(
    private routesClient: RoutesClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.routesClient.fetchRoutes().subscribe(routes => {
      this.datasource.data = routes;
    });
  }

  applyFilter(event: Event) {
    this.datasource.filter = (event.target as HTMLInputElement).value;
  }

  openAddRouteDialog() {
    const dialogRef = this.dialog.open(AddNewRouteComponent);
  }

  openEditRouteDialog(id: string) {}

  deleteRoute(id: string) {}
}