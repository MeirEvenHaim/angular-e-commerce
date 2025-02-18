import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { PaymentComponent } from './components/payment/payment.component';
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
import { RegisterComponent } from './register/register.component';
import {MatFormFieldModule} from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { CartItemsComponent } from './components/cart-linked-products/cart-linked-products.component';
import { HomepageComponent } from './homepage/homepage.component';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { ShippingComponent } from './components/shipping/shipping.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PaymentComponent,
    CartComponent,
    ProductComponent,
    RegisterComponent,
    CartItemsComponent,
    HomepageComponent,
    SuppliersComponent,
    CategoriesComponent,
    ShippingComponent,


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
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  providers: [provideHttpClient(withFetch()), provideAnimationsAsync()], // No need to provide HttpClient here if not using withFetch
  bootstrap: [AppComponent]
})
export class AppModule { }
