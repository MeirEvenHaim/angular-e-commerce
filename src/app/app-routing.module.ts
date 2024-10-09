import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from "./components/product/product.component";

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cart', component: CartComponent },  // Define the cart route
    { path: 'payment', component: PaymentComponent },
    { path: 'shop', component: ProductComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
