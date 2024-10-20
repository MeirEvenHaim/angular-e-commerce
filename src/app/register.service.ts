import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl = 'http://127.0.0.1:8000/register/';  // Django API base URL

  constructor(private http: HttpClient) { }

  // Common HTTP Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Register new user (using POST http mthod :D)
  register(userData: any): Observable<any> {
    return this.http.post(this.baseUrl, userData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  // Handle any errors from the server when we are d7umb and connecting poorly
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error (client is allways right)
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error (we are allways at fault)
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
