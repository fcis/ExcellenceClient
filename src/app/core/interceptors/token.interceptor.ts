// src/app/core/interceptors/token.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

/**
 * Token interceptor function that adds the auth token to requests
 * and handles authentication errors
 */
export const tokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Inject the required services
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Get the auth token
  const token = authService.getToken();
  
  // Debug the token
  console.log(`Token interceptor - URL: ${request.url}, Token exists: ${!!token}`);
  
  // Skip token for login requests
  const isLoginRequest = request.url.endsWith('/api/Auth/login');
  
  // If token exists and not a login request, add it to the Authorization header
  if (token && !isLoginRequest) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Added Authorization header to request');
  }

  // Continue with the request and handle errors
  return next(request).pipe(
    tap(response => {
      // Log successful responses for debugging
      if (response.type !== 0) { // Skip UploadProgress events
        console.log(`Response from ${request.url}:`, response);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(`Error from ${request.url}:`, error);
      
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        console.warn('Received 401 Unauthorized - logging out user');
        authService.logout();
        router.navigate(['/login'], { 
          queryParams: { 
            returnUrl: router.url,
            authError: 'session_expired' 
          } 
        });
      }
      
      // Handle 403 Forbidden errors
      if (error.status === 403) {
        console.warn('Received 403 Forbidden - insufficient permissions');
      }
      
      return throwError(() => error);
    })
  );
};