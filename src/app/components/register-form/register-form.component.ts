import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Airport, AirportService } from '../../services/airport.service';
import { Observable, of, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent implements OnInit {
  form: FormGroup;
  filteredAirports: Observable<Airport[]> = new Observable();

  constructor(
    private fb: FormBuilder,
    private airportsService: AirportService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      homeAirport: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.form.controls['homeAirport'].valueChanges
      .pipe(startWith(''))
      .subscribe(value =>
        this.airportsService.searchAirport(value).subscribe(aiports => {
          this.filteredAirports = of(aiports);
        })
      );
  }

  onSubmit() { }

  displayAirport(airport: Airport): string {
    return (airport && `${airport.icao} - ${airport.name}`) || '';
  }
}
