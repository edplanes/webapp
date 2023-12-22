import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private redirectUrl = '/user';

  constructor(
    private router: Router,
    route: ActivatedRoute
  ) {
    route.queryParams.subscribe(params => {
      if (!params['redirectUrl']) return;

      this.redirectUrl = params['redirectUrl'];
    });
  }

  loginSuccessed() {
    console.log(this.redirectUrl);
    this.router.navigateByUrl(this.redirectUrl);
  }
}
