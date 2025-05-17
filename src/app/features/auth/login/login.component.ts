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

@Component({
  selector: 'app-login',
  standalone: true, // This makes it a standalone component (no need for NgModule)
  imports: [
    // Import all the modules this component needs
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
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
      email: ['', [Validators.required, Validators.email]], // Email field with validation
      password: ['', [Validators.required, Validators.minLength(6)]] // Password field with validation
    });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    // Don't submit if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Set loading state to true and clear any previous errors
    this.isLoading = true;
    this.error = null;

    // Call the auth service login method
    this.authService.login(this.loginForm.value)
      .pipe(
        // Always set loading to false when done, regardless of success or error
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        // Handle successful login
        next: () => {
          this.router.navigateByUrl(this.returnUrl);
        },
        // Handle login error
        error: (error) => {
          if (error.status === 401) {
            this.error = 'Invalid email or password';
          } else {
            this.error = 'An error occurred. Please try again later.';
          }
          console.error('Login error:', error);
        }
      });
  }
}