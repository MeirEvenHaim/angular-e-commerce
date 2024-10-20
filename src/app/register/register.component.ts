import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router  // Inject Router for navigation
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      is_staff: [false]  // Checkbox for admin registration
    });
  }

  // Submit registration form
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerService.register(this.registerForm.value).subscribe(
        (response) => {
          this.message = 'User registered successfully!';
          this.isLoading = false;
          this.registerForm.reset();  // Reset form after success

          // Redirect to login page after successful registration
          this.router.navigate(['/login']);
        },
        (error) => {
          this.message = `Registration failed: ${error.message}`;
          this.isLoading = false;
        }
      );
    } else {
      this.message = 'Please fill in all required fields correctly.';
    }
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }
}
