// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivateFn, 
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * This is a functional guard that protects routes from unauthenticated access
 * It redirects to the login page if the user is not authenticated
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // Inject the required services
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Check if the user is authenticated
  return authService.isAuthenticated$.pipe(
    // Take only one emission, then complete
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        // If authenticated, allow access
        return true;
      } else {
        // If not authenticated, redirect to login with the intended destination as a query param
        router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }
    })
  );
};