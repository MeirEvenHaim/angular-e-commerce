import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { name: '', description: '', price: 0, stock: 0, supplier: null, category: null, image: null };
  isAdmin: boolean = false; // Check if user is admin
  editProductId: number | null = null; // Track product being edited

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.checkAdminStatus(); // Check if admin for conditional rendering
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data.map(product => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price // Convert if it's a string
        }));
        console.log('Fetched products:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  // Add new product or update an existing one
  addProduct(): void {
    if (!this.isAdmin) {
      console.error('User does not have permission to add products');
      return; // Exit if not admin
    }

    if (this.editProductId) {
      this.updateProduct(this.editProductId, this.newProduct);
    } else {
      this.productService.createProduct(this.newProduct).subscribe(
        (data) => {
          this.fetchProducts(); // Refresh product list
          this.resetForm();
        },
        (error) => {
          console.error('Error adding product:', error);
        }
      );
    }
  }

  // Set product to edit
  editProduct(product: Product): void {
    if (!this.isAdmin) {
      console.error('User does not have permission to edit products');
      return; // Exit if not admin
    }

    this.newProduct = { ...product }; // Clone details to form
    this.editProductId = product?.id ?? null;
  }

  // Update product by ID
  updateProduct(id: number, updatedProduct: Product): void {
    if (!this.isAdmin) {
      console.error('User does not have permission to update products');
      return; // Exit if not admin
    }

    this.productService.updateProduct(id, updatedProduct).subscribe(
      () => {
        this.fetchProducts(); // Refresh products
        this.resetForm();
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }

  // Delete product by ID
  deleteProduct(id: number | undefined): void {
    if (!this.isAdmin) {
      console.error('User does not have permission to delete products');
      return; // Exit if not admin
    }

    if (id === undefined) {
      console.error('Product ID is undefined');
      return;
    }

    if (window.confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.fetchProducts(); // Refresh the product list after deletion
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  // Check if the user is an admin (stored role)
  checkAdminStatus(): void {
    const userRole = localStorage.getItem('role'); // Retrieve role from localStorage
    const isStaff = localStorage.getItem('is_staff') === 'true'; // Check if user is staff
    const isSuperuser = localStorage.getItem('is_superuser') === 'true'; // Check if user is superuser

    this.isAdmin = isStaff || isSuperuser; // User is admin if staff or superuser
  }

  // Reset form and edit mode
  resetForm(): void {
    this.newProduct = { name: '', description: '', price: 0, stock: 0, supplier: null, category: null, image: null };
    this.editProductId = null;
  }
}
