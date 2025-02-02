import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from "./components/product/product.component";
import { RegisterComponent } from './register/register.component';
import { CartItemsComponent } from './components/cart-linked-products/cart-linked-products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { ShippingComponent } from './components/shipping/shipping.component';


const routes: Routes = [
    { path: 'client_cart', component: CartItemsComponent  },
    { path: 'login', component: LoginComponent },
    { path: 'cart', component: CartComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'Home', component: ProductComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'supplier', component: SuppliersComponent },
    { path: 'shipping', component: ShippingComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
