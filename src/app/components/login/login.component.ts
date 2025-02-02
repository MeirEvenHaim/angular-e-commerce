import { Component } from '@angular/core';
import { AuthService } from '../../services copy/login_service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  buttonStyles: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  onMouseMove(event: MouseEvent, buttonId: string) {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Calculate the percentage of mouse position in the button
    const xPercentage = (x / width) * 100;
    const yPercentage = (y / height) * 100;

    // Update the dynamic gradient based on mouse position
    this.buttonStyles[buttonId] = {
      background: `linear-gradient(45deg, rgba(155, 28, 28, 0.9) ${xPercentage}%, rgba(155, 28, 28, 0.7) ${100 - xPercentage}%)`,
      boxShadow: `0 6px 18px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.3)`
    };
  }

  onMouseLeave(buttonId: string) {
    // Reset the button style back to default Ruby Red
    this.buttonStyles[buttonId] = {
      background: '#9b1c1c',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)'
    };
  }

  onLogin(): void {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        response => {
          console.log("res", response);
          if (response.access && response.is_staff !== undefined && response.is_superuser !== undefined) {
            this.authService.saveToken(response.access, response.is_staff, response.is_superuser, response.user_id);
            this.router.navigate(['Home/']);
          } else {
            this.errorMessage = 'No access token or role information received';
            console.error('Invalid response:', response);
          }
        },
        error => {
          this.errorMessage = 'Invalid username or password';
          console.error('Login error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }
  onReset() {
    this.username = '';
    this.password = '';
  }
}
