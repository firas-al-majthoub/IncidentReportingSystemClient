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
import { HttpErrorResponse } from '@angular/common/http';

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
  protected username = '';
  protected password = '';

  protected loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(7),
    ]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private toastsService: ToastsService,
    private router: Router,
  ) {}

  protected togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  protected usernameChanged(val: string): void {
    this.username = val;
    this.loginForm.controls.username.setValue(val);
    this.loginForm.controls.username.updateValueAndValidity();
  }

  protected allowOnlyNumbers(event: KeyboardEvent): void {
    // Allow functional navigation/editing keys
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Block the keypress if it is not a digit (0-9)
    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber) {
      event.preventDefault();
    }
  }

  protected onPasswordKeydown(event: KeyboardEvent): void {
    if (event.key == 'Enter') this.signIn();
  }

  protected signIn() {
    if (this.username.length < 7 || this.username.length > 7) {
      this.toastsService.showError('Username must be exaclty 7 digits long');
      return;
    }

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.signIn(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status == 401) {
          this.toastsService.showError('Incorrect Username or Password');
        } else {
          this.toastsService.showError('Error occurred');
        }
      },
    });
  }
}
