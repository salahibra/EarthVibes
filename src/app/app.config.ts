import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({ 
      projectId: "angular-login-86255", 
      appId: "1:902829575724:web:e58848956f0bc65dc58b89", 
      storageBucket: "angular-login-86255.firebasestorage.app", 
      apiKey: "AIzaSyCMJMENLX4V4_fgO8aSDh2hL7YRUlzL4GI", 
      authDomain: "angular-login-86255.firebaseapp.com", 
      messagingSenderId: "902829575724"
    })), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())
  ]
};
