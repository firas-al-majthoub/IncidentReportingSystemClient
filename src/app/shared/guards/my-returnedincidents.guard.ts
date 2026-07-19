import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SystemScreensEnum } from '../data/enum/system-screens.enum';
import { SystemPrivilegesEnum } from '../data/enum/system-privileges.enum';
import { catchError, map, of } from 'rxjs';
import { UsersService } from '../services/users.service';

export const MyReturnedIncidentsGuard: CanActivateFn = (route, state) => {
  const usersService: UsersService = inject(UsersService);
  const router: Router = inject(Router);

  return usersService
    .userHasPrivilege(
      SystemScreensEnum.MyReturnedIncidents,
      SystemPrivilegesEnum.Read,
    )
    .pipe(
      map(() => {
        return true;
      }),
      catchError(() => {
        return of(router.parseUrl(''));
      }),
    );
};
