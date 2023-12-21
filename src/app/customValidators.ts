import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static pattern(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const valid = regex.test(control.value);

      return valid ? null : error;
    };
  }

  static passwordMatch(
    passwordControlName: string = 'password',
    confirmPasswordControlName: string = 'confirmPassword'
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordControlName)?.value;
      const confirmPassword = control.get(confirmPasswordControlName)?.value;

      if (password != confirmPassword) {
        control
          .get(confirmPasswordControlName)
          ?.setErrors({ nopasswordmatch: true });
      }

      return null;
    };
  }
}
