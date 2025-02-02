import { Component, OnInit } from '@angular/core';
import { ShippingService } from '../../services copy/shipping_services/shipping.service';
import { Shipping } from '../../models file/shippingModel';
import { Router } from '@angular/router'; // For navigation

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {
  cart: number = 0;
  shippings: Shipping[] = [];
  selectedShipping: Shipping | null = null;
  newShipping: Shipping = {
    id: 0,
    cart_id: this.cart,
    shipping_address: '',
    shipping_date: null,
    shipping_method: 'Standard',
    delivery_date: null
  };
  loading = false;
  errorMessage = '';
  buttonStyles: any = {};

  constructor(private shippingService: ShippingService , private router: Router) {
    this.cart = this.router.getCurrentNavigation()?.extras.state!['cartId'];
    console.log('HOHOHO', this.cart);
  }

  ngOnInit(): void {
    this.loadShippings();
  }

  loadShippings(): void {
    this.loading = true;
    this.shippingService.Detailed_Shipping_info().subscribe(
      (data) => {
        this.shippings = data;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error loading shipping details!';
        this.loading = false;
      }
    );
  }

  createShipping(): void {
    this.loading = true;
    this.newShipping.cart_id = this.cart;

    // Check if a shipping already exists for the selected cart
    const existingShipping = this.shippings.find(
      (shipping) => shipping.cart_id === this.newShipping.cart_id
    );

    if (existingShipping) {
      this.errorMessage = `Shipping order for ${this.newShipping.cart_id} already exists cannot have two shippings of the same order.`;
      this.loading = false;
      console.log(this.errorMessage); // Debugging log
      return;
    }

    // Proceed to create the shipping record if no existing shipping is found
    this.shippingService.Creating_Shipping_Schedule(this.newShipping).subscribe(
      (data) => {
        this.shippings.push(data);
        this.resetNewShipping();
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error creating shipping schedule!';
        this.loading = false;
      }
    );
  }

  updateShipping(): void {
    if (this.selectedShipping) {
      this.loading = true;
      this.shippingService.Updating_shipping_info(this.selectedShipping?.cart_id, this.selectedShipping).subscribe(
        (data) => {
          const index = this.shippings.findIndex(sh => sh.id! === data.id!);
          if (index !== -1) {
            this.shippings[index] = data;
          }
          this.selectedShipping = null;
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Error updating shipping information!';
          this.loading = false;
        }
      );
    }
  }

  deleteShipping(id: number): void {
    this.loading = true;
    this.shippingService.Deleting_Shipping_info(id).subscribe(
      () => {
        this.shippings = this.shippings.filter(sh => sh.id !== id);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error deleting shipping information!';
        this.loading = false;
      }
    );
  }

  resetNewShipping(): void {
    this.newShipping = {
      id: 0,
      cart_id: 0,
      shipping_address: '',
      shipping_date: null,
      shipping_method: 'Standard',
      delivery_date: null
    };
  }

  selectShipping(shipping: Shipping): void {
    this.selectedShipping = { ...shipping };
  }

  deselectShipping(): void {
    this.selectedShipping = null;
  }
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
  goToShop(): void {
    this.router.navigate(['/cart']);
  }
  GoHome(): void {
    this.router.navigate(['/Home']);
  }

  logout(): void {
    // Clear user data from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('__paypal_storage__');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_superuser');
    this.router.navigate(['/login'])
  }


  Suppliers(): void {
    this.router.navigate(['/supplier']);
  }
}

