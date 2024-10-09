import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Add your CSS file if needed
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        response => {
          // Check if the response contains both access token and role information
          if (response.access && response.is_staff !== undefined && response.is_superuser !== undefined) {
            // Save the access token, staff status, and superuser status
            this.authService.saveToken(response.access, response.is_staff, response.is_superuser);
            this.router.navigate(['cart/']); // Adjust the route as needed
          } else {
            this.errorMessage = 'No access token or role information received';
            console.error('Invalid response:', response);
          }
        },
        error => {
          // Handle login errors
          this.errorMessage = 'Invalid username or password';
          console.error('Login error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
}
