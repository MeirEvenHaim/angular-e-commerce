
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CategoriesService } from '../../services copy/categories_service/categories.service';
import { Categories } from '../../models file/categoriesModel';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Categories[] = [];
  newCategory: Categories = { name: '', description: null };
  selectedCategory: Categories | null = null;
  errorMessage: string = '';
  filteredCategories = this.categories;
  searchQuery: string = '';
  buttonStyles: any = {};
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteDialogTemplate') deleteDialogTemplate!: TemplateRef<any>;

  constructor(
     private categoriesService: CategoriesService,
     private dialog: MatDialog,
     private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadCategories();
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

  openDeleteDialog(category: any) {
    const dialogRef = this.dialog.open(this.deleteDialogTemplate, {
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteCategory(category.id); // Perform delete if user confirms
      }
    });
  }

  // Open dialog to view description
  openDialog(category: Categories): void {
    this.selectedCategory = category;
    this.dialog.open(this.dialogTemplate);
  }


 filterCategories() {
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  clearSelection() {
    this.searchQuery = '';
    this.filterCategories();
  }

// Create a new category
createCategory(): void {
  // Call the service method to create the category and pass the form data
  this.categoriesService.createCategory(this.newCategory).subscribe({
    next: (category) => {
      // Add the created category to the list of categories
      this.categories.push(category);

      // Show success notification
      this.snackBar.open('Category Created Successfully!', 'Close', { duration: 2000 });

      // Reset the form for creating new categories
      this.newCategory = { name: '', description: null };
    },
    error: () => this.snackBar.open('Error creating category', 'Close', { duration: 2000 })
  });
}

  // Update an existing category
  updateCategory(): void {
    if (this.selectedCategory) {
      const categoryId = this.selectedCategory.id; // Assuming `id` is the identifier for the category
      this.categoriesService.updateCategory(categoryId!, this.selectedCategory).subscribe({
        next: () => {
          this.snackBar.open('Category Updated Successfully!', 'Close', { duration: 2000 });
          this.loadCategories(); // Reload categories
          this.selectedCategory = null; // Clear the selected category after updating
        },
        error: () => this.snackBar.open('Error updating category', 'Close', { duration: 2000 })
      });
    }
  }







  deleteCategory(id: number | undefined): void {
    if (id !== undefined) {
      this.categoriesService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter((cat) => cat.id !== id);
        },
        error: (err) => (this.errorMessage = 'Failed to delete category.')
      });
    } else {
      console.error('Invalid category ID');
    }
  }
}

