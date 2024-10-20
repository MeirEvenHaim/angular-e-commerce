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
  newProduct: Product = { name: '', description: '', price: 0, stock: 0, supplier_id: null, category_id: null, image: null , category : null , supplier : null};
  selectedFile: File | null = null; // Variable to store the selected file
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
        // Ensure price is correctly formatted
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

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Store the selected file
    }
  }

  // Add new product or update an existing one
  addProduct(): void {
    if (!this.isAdmin) {
      console.error('User does not have permission to add products');
      return; // Exit if not admin
    }

    // Log the new product data and file before sending it to the service
    console.log('Product data before sending:', this.newProduct);
    console.log('File data before sending:', this.selectedFile);
    // We log here to ensure the product and file data is correct before calling the service

    if (this.editProductId !== null) {
      this.updateProduct(this.editProductId, this.newProduct, this.selectedFile); // Pass selected file
    } else {
      this.productService.createProduct(this.newProduct, this.selectedFile ?? null).subscribe( // Use null if selectedFile is undefined
        (data) => {
          console.log('Product created:', data);
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
    this.selectedFile = null; // Reset selected file when editing
  }

  // Update existing product
  updateProduct(id: number, updatedProduct: Product, selectedFile: File | null = null): void { // Set default to null
    if (!this.isAdmin) {
      console.error('User does not have permission to update products');
      return; // Exit if not admin
    }

    // Call updateProduct from ProductService with the required parameters
    this.productService.updateProduct(id, updatedProduct, selectedFile).subscribe(
      () => {
        console.log('Product updated successfully');
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
          console.log('Product deleted successfully');
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
    this.newProduct = { name: '', description: '', price: 0, stock: 0, supplier_id: null, category_id: null, image: null ,category : null , supplier : null };
    this.editProductId = null;
    this.selectedFile = null; // Reset the selected file
  }
}
