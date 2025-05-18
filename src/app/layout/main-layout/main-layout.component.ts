// src/app/layout/main-layout/main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
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
  sidebarCollapsed = false; // Default expanded sidebar

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to the user observable
    this.user$ = this.authService.currentUser$;
    
    // Set active tab based on current route initially
    this.updateActiveTabFromUrl(this.router.url);
    
    // Subscribe to router events to update active tab
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateActiveTabFromUrl(event.url);
    });

    // Check for stored sidebar preference
    this.loadSidebarPreference();
  }

  /**
   * Updates the active tab based on the current URL
   */
  private updateActiveTabFromUrl(url: string): void {
    const path = url.split('/')[1] || 'dashboard';
    this.activeTab = path;
    console.log('Active tab set to:', this.activeTab);
  }

  /**
   * Sets the active tab and navigates to that route
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Toggles the sidebar between collapsed and expanded states
   */
  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.saveSidebarPreference();
  }

  /**
   * Saves the sidebar state to localStorage
   */
  private saveSidebarPreference(): void {
    localStorage.setItem('sidebar_collapsed', this.sidebarCollapsed.toString());
  }

  /**
   * Loads the sidebar state from localStorage
   */
  private loadSidebarPreference(): void {
    const stored = localStorage.getItem('sidebar_collapsed');
    if (stored !== null) {
      this.sidebarCollapsed = stored === 'true';
    }
  }

  /**
   * Logs the user out and navigates to the login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}