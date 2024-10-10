import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const afAuth = inject(AngularFireAuth);
  const router = inject(Router);

  return afAuth.authState.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
