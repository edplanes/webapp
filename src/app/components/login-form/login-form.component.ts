import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';

const errorMessages = {
  required: (key: string) => `Field ${key} is required!`,
  email: () => `Email is invalid!`
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  form: FormGroup
  errors: string[] = []

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    this.errors = []
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(key => {
        const errs = this.form.controls[key].errors
        if (errs!["required"])
          this.errors?.push(errorMessages.required(key))
        if (errs!["email"])
          this.errors?.push(errorMessages.email())
      })
      return
    }

    const val = this.form.value
    this.authService.login(val.email, val.password)
      .subscribe(() => this.router.navigateByUrl("/"))
  }
}
