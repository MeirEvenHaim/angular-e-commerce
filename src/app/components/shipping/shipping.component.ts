import { Component, OnInit } from '@angular/core';
import { ShippingService } from '../../services copy/shipping_services/shipping.service';
import { Shipping } from '../../models file/shippingModel';
import { Router } from '@angular/router'; // For navigation
import { NgForm } from '@angular/forms';

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
}
