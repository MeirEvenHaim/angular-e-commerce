import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html', // Your HTML template file
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Initialize the form with validation
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return; // Stop if the form is invalid
    }

    const { username, password } = this.loginForm.value;

    // Call login method from AuthService
    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/']); // Navigate to the main page after login
      },
      error: (error) => {
        this.errorMessage = error; // Display error message
        console.error('Login failed:', error);
      },
    });
  }
}
