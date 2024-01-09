import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { LogService } from '../../services/log/log.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private logger: LogService,
    private router: Router,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.min(6)]],
    });
  }

  ngOnInit(): void {
    this.logger.debug(
      'Initializing login form with user authenticated: ',
      this.authService.isAuthenticated
    );
    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl('/user');
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const val = this.form.value;
    this.authService.login(val.email, val.password).subscribe({
      next: () => {
        this.snackBar.dismiss();
        this.router.navigateByUrl('/user');
      },
      error: (err: Error) => {
        this.snackBar.open(err.message, 'Ok', { duration: 2500 });
      },
    });
  }
}
