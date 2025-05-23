// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService, DashboardData } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Loads dashboard data from the API
   */
  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        console.log('Dashboard data loaded:', data);
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.error = 'Failed to load dashboard data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Retry loading dashboard data if there was an error
   */
  retryLoading(): void {
    this.loadDashboardData();
  }
}