import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { tokenInterceptor } from '../app/core/interceptors/token.interceptor';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [
    // Set up the router with the routes and view transitions
    provideRouter(routes, withViewTransitions()),
    // Set up HTTP client with the token interceptor
    provideHttpClient(withInterceptors([tokenInterceptor])),
    // Set up animations for Material components
    provideAnimations()
    ]
};
