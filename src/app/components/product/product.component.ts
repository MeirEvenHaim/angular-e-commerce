import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services copy/product_services/product.service';
import { SuppliersService } from '../../services copy/supplier_services/suppliers.service';
import { CategoriesService } from '../../services copy/categories_service/categories.service';
import { Categories } from '../../models file/categoriesModel';
import { Suppliers } from '../../models file/supplierModel';
import { Product } from '../../models file/productModel';
import { FormControl  } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  supplier_list = new FormControl('');
  categories_list = new FormControl('');
  categories: Categories[] = [];
  suppliers: Suppliers[] = [];
  products: Product[] = [];
  newProduct: Product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    supplier_id: null,
    category_id: null,
    image: null,
    category: null,
    supplier: null,
  };
  selectedFile: File | null = null;
  isAdmin: boolean = false;
  editProductId: number | null = null;
  buttonStyles: any = {};

  constructor(
    private productService: ProductService,
    private suppliersService: SuppliersService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.checkAdminStatus(); // Check if admin for conditional rendering
  }

  // Load all categories
  loadCategories(): void {
    this.categoriesService.CategoriesMenu().subscribe(
      (data: Categories[]) => {
        console.log('data', data);

        this.categories = data;
      },
      (error) => {
        console.error('Error fetching carts', error);
      }
    );
  }
  loadSupplier(): void {
    this.suppliersService.SuppliersMenu().subscribe(
      (data: Suppliers[]) => {
        console.log('data', data);

        this.suppliers = data;
      },
      (error) => {
        console.error('Error fetching carts', error);
      }
    );
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        // Ensure price is correctly formatted
        this.products = data.map((product) => ({
          ...product,
          price:
            typeof product.price === 'string'
              ? parseFloat(product.price)
              : product.price, // Convert if it's a string
        }));
        this.loadCategories();
        this.loadSupplier();
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

  addProduct(): void {
    if (!this.isAdmin) {
      console.error('User does not have permission to add products');
      return;
    }

    // Convert supplier_id and category_id to numbers (if they are not null)
    this.newProduct.supplier_id = this.supplier_list.value ? Number(this.supplier_list.value) : null;
    this.newProduct.category_id = this.categories_list.value ? Number(this.categories_list.value) : null;

    console.log('Product data before sending:', this.newProduct);
    console.log('File data before sending:', this.selectedFile);

    if (this.editProductId !== null) {
      this.updateProduct(this.editProductId, this.newProduct, this.selectedFile);
    } else {
      this.productService.createProduct(this.newProduct, this.selectedFile ?? null).subscribe(
        (data) => {
          console.log('Product created:', data);
          this.fetchProducts();
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
  updateProduct(
    id: number,
    updatedProduct: Product,
    selectedFile: File | null = null
  ): void {
    // Set default to null
    if (!this.isAdmin) {
      console.error('User does not have permission to update products');
      return; // Exit if not admin
    }

    // Call updateProduct from ProductService with the required parameters
    this.productService
      .updateProduct(id, updatedProduct, selectedFile)
      .subscribe(
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
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      supplier_id: null,
      category_id: null,
      image: null,
      category: null,
      supplier: null,
    };
    this.editProductId = null;
    this.selectedFile = null; // Reset the selected file
  }

  // product client list in cart methodes
  addedproducts(product_id: number): void {
    // this.cartProductListService.addToCart(cartproducts);
    console.log('product_id', product_id);

    let quantity = (document.getElementById('quantity') as HTMLInputElement)
      ?.value!;
    console.log(quantity, 'lololol');
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
}
