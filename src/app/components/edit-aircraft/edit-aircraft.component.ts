import { Component, Inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AircraftsService } from '../../services/aircrafts/aircrafts.service';
import { Aircraft, Airframe } from '../../clients/aircrafts.client';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-edit-aircraft',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './edit-aircraft.component.html',
  styleUrl: './edit-aircraft.component.scss',
})
export class EditAircraftComponent {
  aircraftForm: FormGroup;
  filteredAirframes: Airframe[] = [];

  constructor(
    private aircraftsService: AircraftsService,
    private dialogRef: MatDialogRef<EditAircraftComponent>,
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: Aircraft
  ) {
    this.aircraftForm = fb.group({
      name: [data?.name, Validators.required],
      airframe: [data?.airframe, Validators.required],
      maxFuelOnBoard: [data?.customWeights?.maximumFuelOnBoard],
      maxLandingWeight: [data?.customWeights?.maximumLandingWeight],
      maxTakeoffWeight: [data?.customWeights?.maximumTakeoffWeight],
      maxZeroFuelWeight: [data?.customWeights?.maximumZeroFuelWeight],
      emptyWeight: [data?.customWeights?.operationalEmptyWeight],
    });

    this.aircraftForm.controls['airframe'].valueChanges
      .pipe(startWith(''))
      .subscribe(
        value =>
          typeof value === 'string' &&
          this.aircraftsService.searchAirframe(value).subscribe(airframes => {
            this.filteredAirframes = airframes;
          })
      );
  }

  displayAirframe(airframe: Airframe) {
    return airframe.icao;
  }

  onSubmit() {
    if (!this.aircraftForm.valid) return;

    const value = this.aircraftForm.value;

    const aircraft: Aircraft = {
      id: this.data?.id,
      name: value['name'],
      airframe: value['airframe'],
    };

    if (
      value['maxFuelOnBoard'] ||
      value['maxTakeoffWeight'] ||
      value['maxLandingWeight'] ||
      value['maxZeroFuelWeight'] ||
      value['emptyWeight']
    ) {
      aircraft.customWeights = {
        maximumFuelOnBoard: value['maxFuelOnBoard'],
        maximumTakeoffWeight: value['maxTakeoffWeight'],
        maximumLandingWeight: value['maxLandingWeight'],
        maximumZeroFuelWeight: value['maxZeroFuelWeight'],
        operationalEmptyWeight: value['emptyWeight'],
      };
    }

    if (aircraft.id) {
      this.aircraftsService.updateAircraft(aircraft).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.aircraftsService.addAircraft(aircraft).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
