// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../core/models/auth.models';

// Angular Material imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  user$!: Observable<User | null>; 

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    // Directly get the current user from the service
    const currentUser = this.authService.getCurrentUser();
    console.log('Dashboard initialization - direct getCurrentUser():', currentUser);
    
    // Get the user as an observable
    this.user$ = this.authService.currentUser$;
    
    // Debug: Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      console.log('Dashboard - currentUser$ subscription update:', user);
      
      // If user is null but we should be logged in, attempt to reload from storage
      if (!user && localStorage.getItem('auth_token')) {
        console.log('User is null but token exists - potential issue with loading user data');
        
        // If there's no user but we have a token, try to navigate back to login
        // This will force a re-authentication
        if (!user) {
          console.log('Redirecting to login to force re-authentication');
          this.router.navigate(['/login']);
        }
      }
    });
    
    // Also check authentication state
    this.authService.isAuthenticated$.subscribe(isAuth => {
      console.log('Dashboard - isAuthenticated$:', isAuth);
    });
  }
  
  /**
   * Logs the user out and navigates to the login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}