import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from './environments/environment';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxSpinnerService } from 'ngx-spinner';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebaseConfig)
    ),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    importProvidersFrom(AngularFireAuthModule),
    provideHttpClient(),
    provideFirestore(() => getFirestore()),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    provideAnimations(),
    NgxSpinnerService,
  ],
};
