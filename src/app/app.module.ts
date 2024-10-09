import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Your routing module
import { RouterModule } from '@angular/router'; // RouterModule for routing
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for template-driven forms
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule if using reactive forms
import { AppComponent } from './app.component';
// Import other components here
import { LoginComponent } from './components/login/login.component'; // Example import
import { PaymentComponent } from './components/payment/payment.component'; // Example import
import { NgxPayPalModule } from 'ngx-paypal';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartComponent } from './components/cart/cart.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProductComponent } from "./components/product/product.component";



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PaymentComponent,
    CartComponent,
    ProductComponent
  ],


  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule, // Include your routing module
    RouterModule, // RouterModule for routing
    HttpClientModule, // Include HttpClientModule for HTTP requests
    FormsModule, // Include FormsModule for template-driven forms
    ReactiveFormsModule, // Optionally include if using reactive forms
    NgxPayPalModule ,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
  ],
  providers: [provideHttpClient(withFetch()), provideAnimationsAsync()], // No need to provide HttpClient here if not using withFetch
  bootstrap: [AppComponent]
})
export class AppModule { }
