// src/app/core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface DashboardData {
  noOfOrganizations: number;
  noOfUsers: number;
  noOfAdmins: number;
  noOfFrameworks: number;
  noOfCategories: number;
  noOfClauses: number;
  noOfAssesments: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<ApiResponse<DashboardData>>(`${environment.apiUrl}/api/Dashboard`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Failed to get dashboard data');
          }
          return response.data;
        })
      );
  }
}