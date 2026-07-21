import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UsersService } from '../services/users.service';

export const SystemAdminGuard: CanActivateFn = (route, state) => {
  const usersService: UsersService = inject(UsersService);
  const router: Router = inject(Router);

  return usersService.isUserSystemAdmin().pipe(
    map(() => {
      return true;
    }),
    catchError(() => {
      return of(router.parseUrl(''));
    }),
  );
};
