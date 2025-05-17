import { Component, OnInit } from '@angular/core'; // Add OnInit
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { User } from '../../core/models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule
    ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit { // Implement OnInit
  
  user$!: Observable<User | null>; 

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
      // Add this for debugging
  this.authService.currentUser$.subscribe(user => {
    console.log('Current user:', user);
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