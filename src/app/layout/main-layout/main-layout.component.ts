// src/app/layout/main-layout/main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../core/models/auth.models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  user$!: Observable<User | null>;
  activeTab = 'dashboard'; // Default active tab

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
    
    // Set active tab based on current route
    const currentRoute = this.router.url.split('/')[1] || 'dashboard';
    this.activeTab = currentRoute;
  }

  /**
   * Sets the active tab and navigates to that route
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Logs the user out and navigates to the login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}