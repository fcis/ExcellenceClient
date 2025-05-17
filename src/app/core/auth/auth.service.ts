// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse, User } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root' // This makes the service a singleton available throughout the app
})
export class AuthService {
  // Storage keys for local storage
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  
  // BehaviorSubject to track the current user - emits the current value to new subscribers
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  // Public observable that components can subscribe to
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  // Public observable for authentication state
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in when service is created
    this.loadUserFromStorage();
  }

  /**
   * Loads user data from local storage if it exists
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData) {
      try {
        // Parse the stored user data
        const user = JSON.parse(userData) as User;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        // If there's an error parsing, log the user out
        this.logout();
      }
    }
  }

  /**
   * Authenticates a user with the provided credentials
   * @param credentials The login credentials (email and password)
   * @returns An observable of the User if login is successful
   */
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/Auth/login`, credentials)
      .pipe(
        // If login succeeds, save the auth data
        tap(response => this.handleAuthSuccess(response)),
        // Transform the response to just the User object
        map(response => this.mapResponseToUser(response)),
        // Handle any errors
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Logs the user out by clearing stored data
   */
  logout(): void {
    // We could call a logout API endpoint here if needed
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Gets the stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Gets the stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Gets the current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Handles successful authentication by storing tokens and user data
   */
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    
    const user = this.mapResponseToUser(response);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Maps the auth response to a User object
   */
  private mapResponseToUser(response: AuthResponse): User {
    return {
      id: response.userId,
      username: response.username,
      name: response.name,
      email: response.email,
      role: response.role,
      permissions: response.permissions,
      organizationId: response.organizationId,
      organizationName: response.organizationName
    };
  }
}