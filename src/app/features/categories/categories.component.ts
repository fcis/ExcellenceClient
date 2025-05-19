// src/app/features/categories/categories.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CategoriesService } from '../../core/services/categories.service';
import { Category, PaginatedResult } from '../../core/models/category.models';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatPaginatorModule,
    CategoryDialogComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;
  error: string | null = null;
  searchQuery = '';
  
  // Pagination
  pageSize = 10;
  pageNumber = 1;
  totalItems = 0;
  totalPages = 0;
  Math = Math;
  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.error = null;
    
    this.categoriesService.getCategories(this.pageNumber, this.pageSize).subscribe({
      next: (result) => {
        this.categories = result.items;
        this.pageNumber = result.pageNumber;
        this.pageSize = result.pageSize;
        this.totalItems = result.totalCount;
        this.totalPages = result.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.pageNumber = page;
    this.loadCategories();
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadCategories();
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
 addCategory(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'side-drawer-dialog',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.createCategory(result).subscribe({
          next: () => {
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error creating category:', err);
            this.error = 'Failed to create category. Please try again later.';
          }
        });
      }
    });
  }

  editCategory(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '100%',
      height: '100vh',
      position: { right: '0' },
      panelClass: 'side-drawer-dialog',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms',
      data: { isEdit: true, category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.updateCategory(category.id, result).subscribe({
          next: () => {
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error updating category:', err);
            this.error = 'Failed to update category. Please try again later.';
          }
        });
      }
    });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Category',
        message: 'Are you sure you want to delete this category? This action cannot be undone.',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.deleteCategory(category.id).subscribe({
          next: () => {
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error deleting category:', err);
            this.error = 'Failed to delete category. Please try again later.';
          }
        });
      }
    });
  }
}