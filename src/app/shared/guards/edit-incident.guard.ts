import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SystemScreensService } from '../services/system-screens.service';

export const EditIncidentGuard: CanActivateFn = (route, state) => {
  const systemScreensService: SystemScreensService =
    inject(SystemScreensService);
  const router: Router = inject(Router);

  return systemScreensService.openEditIncident().pipe(
    map(() => {
      return true;
    }),
    catchError(() => {
      return of(router.parseUrl(''));
    }),
  );
};
