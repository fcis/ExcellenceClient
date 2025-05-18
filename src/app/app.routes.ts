// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

export const routes: Routes = [
  // Public routes - accessible without authentication
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent),
    title: 'Login - Tharwah Excellence'
  },
  
  // Protected routes - require authentication
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
        title: 'Dashboard - Tharwah Excellence'
      },
      // {
      //   path: 'frameworks',
      //   loadComponent: () => import('').then(c => c.FrameworksComponent),
      //   title: 'Frameworks - Tharwah Excellence'
      // },
      // {
      //   path: 'categories',
      //   loadComponent: () => import('../app/shared/not-found').then(c => c.CategoriesComponent),
      //   title: 'Categories - Tharwah Excellence'
      // },
      // {
      //   path: 'clauses',
      //   loadComponent: () => import('./features/clauses/clauses.component').then(c => c.ClausesComponent),
      //   title: 'Clauses - Tharwah Excellence'
      // },
      // {
      //   path: 'reports',
      //   loadComponent: () => import('./features/reports/reports.component').then(c => c.ReportsComponent),
      //   title: 'Reports - Tharwah Excellence'
      // },
      // {
      //   path: 'organizations',
      //   loadComponent: () => import('./features/organizations/organizations.component').then(c => c.OrganizationsComponent),
      //   title: 'Organizations - Tharwah Excellence'
      // },
      // {
      //   path: 'users',
      //   loadComponent: () => import('./features/users/users.component').then(c => c.UsersComponent),
      //   title: 'Users - Tharwah Excellence'
      // },
      
      // Default route within authenticated section redirects to dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      
      // 404 component for all unmatched routes within the authenticated section
      {
        path: '**',
        component: NotFoundComponent,
        title: 'Page Not Found - Tharwah Excellence'
      }
    ]
  },
  
  // Fallback - redirect any other routes to login
  {
    path: '**',
    redirectTo: 'login'
  }
];