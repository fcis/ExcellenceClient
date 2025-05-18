// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse, User } from '../models/auth.models';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Storage keys for local storage
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  
  // BehaviorSubject to track the current user
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
        
        // Debug: Verify the user data before setting it
        console.log('Loading user from storage:', user);
        
        // If we have a valid user object with required fields, set it
        if (user && user.id && user.username) {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          console.log('User successfully loaded from storage:', user);
        } else {
          console.error('Invalid user data in storage:', user);
          this.logout(); // Clear invalid data
        }
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
        // If there's an error parsing, log the user out
        this.logout();
      }
    } else {
      console.log('No user data found in storage. Token exists:', !!token, 'User data exists:', !!userData);
    }
  }

  /**
   * Authenticates a user with the provided credentials
   * @param credentials The login credentials (email and password)
   * @returns An observable of the User if login is successful
   */
  login(credentials: LoginRequest): Observable<User> {
    console.log('Login attempt with credentials:', credentials);
    
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/api/Auth/login`, credentials)
      .pipe(
        // Log the raw response for debugging
        tap(response => console.log('Raw login response:', response)),
        
        // Extract the data from the ApiResponse wrapper
        map(response => {
          if (!response.success) {
            console.error('Login failed:', response.message, response.errors);
            throw new Error(response.message || 'Login failed');
          }
          
          // Ensure the data property exists
          if (!response.data) {
            console.error('No data property in successful response:', response);
            throw new Error('Invalid server response format');
          }
          
          return response.data;
        }),
        
        // Log the extracted data
        tap(authResponse => console.log('Extracted auth response:', authResponse)),
        
        // If login succeeds, save the auth data
        tap(authResponse => this.handleAuthSuccess(authResponse)),
        
        // Transform the response to just the User object
        map(authResponse => this.mapResponseToUser(authResponse)),
        
        // Log the mapped user
        tap(user => console.log('Mapped user from auth response:', user)),
        
        // Handle any errors
        catchError(error => {
          console.error('Login error:', error);
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
    console.log('Handling auth success with response:', response);
    
    // Store the tokens in local storage
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    
    // Map the response to a user object
    const user = this.mapResponseToUser(response);
    console.log('Mapped user object:', user);
    
    // Store the user data in local storage
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    // Update the BehaviorSubjects
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    
    // Verify the current state of the subject
    console.log('Current user subject value after login:', this.currentUserSubject.value);
    console.log('Is authenticated subject value after login:', this.isAuthenticatedSubject.value);
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