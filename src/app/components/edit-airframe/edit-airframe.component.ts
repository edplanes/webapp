import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Airframe } from '../../clients/aircrafts.client';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AircraftsService } from '../../services/aircrafts/aircrafts.service';

@Component({
  selector: 'app-edit-airframe',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './edit-airframe.component.html',
  styleUrl: './edit-airframe.component.scss',
})
export class EditAirframeComponent {
  airframeForm: FormGroup;

  constructor(
    private aircraftService: AircraftsService,
    fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAirframeComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Airframe
  ) {
    console.log(data);
    this.airframeForm = fb.group({
      icao: [data?.icao, Validators.required],
      name: [data?.name, Validators.required],
      purpose: [data?.purpose, Validators.required],
      category: [data?.category, Validators.required],
      size: [data?.size, Validators.required],
      maxFuelOnBoard: [
        data?.limitations.weights.maximumFuelOnBoard,
        Validators.required,
      ],
      maxLandingWeight: [
        data?.limitations.weights.maximumLandingWeight,
        Validators.required,
      ],
      maxTakeoffWeight: [
        data?.limitations.weights.maximumTakeoffWeight,
        Validators.required,
      ],
      maxZeroFuelWeight: [
        data?.limitations.weights.maximumZeroFuelWeight,
        Validators.required,
      ],
      emptyWeight: [
        data?.limitations.weights.operationalEmptyWeight,
        Validators.required,
      ],
      cruiseTAS: [data?.defaults.cruiseTAS, Validators.required],
    });
  }

  onSubmit() {
    if (!this.airframeForm.valid) {
      console.log('Invalid form', this.airframeForm.value);
      return;
    }

    const value = this.airframeForm.value;

    const airframe: Airframe = {
      id: this.data?.id,
      icao: value['icao'],
      name: value['name'],
      purpose: value['purpose'],
      category: value['category'],
      size: value['size'],
      limitations: {
        weights: {
          maximumFuelOnBoard: value['maxFuelOnBoard'],
          maximumLandingWeight: value['maxLandingWeight'],
          maximumTakeoffWeight: value['maxTakeoffWeight'],
          maximumZeroFuelWeight: value['maxZeroFuelWeight'],
          operationalEmptyWeight: value['emptyWeight'],
        },
      },
      defaults: {
        cruiseTAS: value['cruiseTAS'],
      },
    };

    if (airframe.id) {
      this.aircraftService.updateAirframe(airframe).subscribe(console.log);
    } else {
      this.aircraftService.addAirframe(airframe).subscribe(console.log);
    }

    this.dialogRef.close(true);
  }
}
