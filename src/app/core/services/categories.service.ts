// src/app/core/services/categories.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category, PaginatedResult } from '../models/category.models';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Category>> {
    let params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResult<Category>>>(`${environment.apiUrl}/api/Categories/GetAllCategories`, { params })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to get categories');
          }
          return response.data;
        })
      );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${environment.apiUrl}/api/Categories/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to get category');
          }
          return response.data;
        })
      );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(`${environment.apiUrl}/api/Categories`, category)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to create category');
          }
          return response.data;
        })
      );
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${environment.apiUrl}/api/Categories/${id}`, category)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to update category');
          }
          return response.data;
        })
      );
  }

  deleteCategory(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${environment.apiUrl}/api/Categories/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to delete category');
          }
          return response.data;
        })
      );
  }
}