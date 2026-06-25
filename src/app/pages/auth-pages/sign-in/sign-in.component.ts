import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastsService } from '../../../shared/services/toasts.service';
import { Router } from '@angular/router';
import { ToastsLayoutComponent } from '../../../shared/layout/app-toasts/app-toasts.component';

@Component({
  selector: 'app-sign-in',
  imports: [
    AuthPageLayoutComponent,
    ReactiveFormsModule,
    LabelComponent,
    InputFieldComponent,
    ButtonComponent,
    ToastsLayoutComponent,
  ],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export class SignInComponent {
  protected isLoading = false;
  protected showPassword = false;
  protected email = '';
  protected password = '';

  protected loginForm = new FormGroup({
    email: new FormControl(this.email, Validators.required),
    password: new FormControl(this.password, Validators.required),
  });

  constructor(
    private authService: AuthService,
    private toastsService: ToastsService,
    private router: Router,
  ) {}

  protected togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  protected signIn() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.signIn(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['']);
      },
      error: () => {
        this.isLoading = false;
        this.toastsService.showError('Error occurred');
      },
    });
  }
}
