
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SuppliersService } from '../../services copy/supplier_services/suppliers.service';
import { Suppliers } from '../../models file/supplierModel';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent {
    suppliers: Suppliers[] = [];
    newsuppliers: Suppliers = { id : 0,name: '', address: "", phone_number: 0 ,contact_email : ''  };
    selectedsupplier: Suppliers | null = null;
    errorMessage: string = '';
    filteredCategories = this.suppliers;
    searchQuery: string = '';
    buttonStyles: any = {};
    successMessage: string | null = null;
    @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
    @ViewChild('deleteDialogTemplate') deleteDialogTemplate!: TemplateRef<any>;

    constructor(
       private suppliersService: SuppliersService,
       private dialog: MatDialog,
       private snackBar: MatSnackBar,
      private router : Router) {}

    ngOnInit(): void {
      this.loadSupplier();
    }

    // Load all categories
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

    openDeleteDialog(supplier: Suppliers): void {
      if (supplier?.id && !isNaN(supplier.id)) {
        this.selectedsupplier = supplier;
        this.dialog.open(this.deleteDialogTemplate);
      } else {
        console.error('Invalid supplier ID:', supplier?.id);
      }
    }

    // Open dialog to view description
    openDialog(supplier: Suppliers): void {
      this.selectedsupplier = supplier;
      this.dialog.open(this.dialogTemplate);
    }


   FilterSupplier() {
      this.filteredCategories = this.suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    clearSelection() {
      this.searchQuery = '';
      this.FilterSupplier();
    }


  createsuppliers(): void {

    this.suppliersService.createSupplier(this.newsuppliers).subscribe({
      next: (s) => {

        this.suppliers.push(this.newsuppliers); ;

        // Show success notification
        this.snackBar.open('supplier Created Successfully!', 'Close', { duration: 2000 });

        // Reset the form for creating new categories
        this.newsuppliers = {id : 0, name: '', address: "", phone_number: 0, contact_email : ""  };
      },
      error: () => this.snackBar.open('Error creating supplier', 'Close', { duration: 2000 })
    });
  }


    updatesupplier(): void {
      if (this.selectedsupplier) {
        const supplierid = this.selectedsupplier.id;
        this.suppliersService.UpdateSupplier(supplierid!, this.selectedsupplier).subscribe({
          next: () => {
            this.snackBar.open('supplier Updated Successfully!', 'Close', { duration: 2000 });
            this.loadSupplier();
            this.selectedsupplier = null;
          },
          error: () => this.snackBar.open('Error updating supplier', 'Close', { duration: 2000 })
        });
      }
    }


    deletesupplier(id: number | undefined): void {
      if (typeof id === 'number' && !isNaN(id) && id !== null) {
        this.suppliersService.Deletesupplier(id).subscribe({
          next: () => {
            this.suppliers = this.suppliers.filter((sup) => sup.id !== id);
            this.closeDialog(); // Close the dialog on success
            this.successMessage = 'Supplier deleted successfully!';
          },
          error: (err) => {
            this.closeDialog(); // Close the dialog on failure
            this.errorMessage = 'Failed to delete supplier.';
          }
        });
      } else {
        console.error('Invalid supplier ID:', id);
        this.closeDialog(); // Close dialog if ID is invalid
        this.errorMessage = 'Invalid supplier ID';
      }
    }

    closeDialog(): void {
      this.dialog.closeAll();  // Close all open dialogs
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
