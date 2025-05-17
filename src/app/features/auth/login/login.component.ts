// src/app/features/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { finalize } from 'rxjs/operators';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Form group for the login form
  loginForm!: FormGroup;
  // Flag to track loading state
  isLoading = false;
  // Property to store error messages
  error: string | null = null;
  // URL to redirect to after login
  returnUrl: string = '/';
  // Toggle password visibility
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  /**
   * Initializes the component
   */
  ngOnInit(): void {
    // Initialize the login form
    this.initForm();
    // Get the return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // If already logged in, redirect to returnUrl
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }

  /**
   * Initializes the login form with validation
   */
  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    // Mark form controls as touched to trigger validation
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });

    // Don't submit if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Set loading state to true and clear any previous errors
    this.isLoading = true;
    this.error = null;

    console.log('Submitting login form with:', this.loginForm.value);

    // Call the auth service login method
    this.authService.login(this.loginForm.value)
      .pipe(
        // Always set loading to false when done, regardless of success or error
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        // Handle successful login
        next: (user) => {
          console.log('Login successful, received user:', user);
          // Verify the user data is stored correctly
          const storedUser = localStorage.getItem('user_data');
          console.log('User data stored in localStorage:', storedUser);
          
          this.router.navigateByUrl(this.returnUrl);
        },
        // Handle login error
        error: (error) => {
          console.error('Login error details:', error);
          
          if (error.status === 401) {
            this.error = 'Invalid email or password';
          } else if (error.error && error.error.message) {
            // Extract error message from API response
            this.error = error.error.message;
          } else if (error.message) {
            this.error = error.message;
          } else {
            this.error = 'An error occurred. Please try again later.';
          }
        }
      });
  }

  /**
   * Fills in admin demo credentials
   */
  fillAdminCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@example.com',
      password: 'Admin@123'
    });
  }

  /**
   * Fills in organization user demo credentials
   */
  fillOrgCredentials(): void {
    this.loginForm.patchValue({
      email: 'orguser@example.com',
      password: 'User123!'
    });
  }
}