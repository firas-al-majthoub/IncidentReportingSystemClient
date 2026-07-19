import { Injectable } from '@angular/core';
import { SystemScreensEnum } from '../data/enum/system-screens.enum';
import { SystemPrivilegesEnum } from '../data/enum/system-privileges.enum';
import { map, Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  userHasPrivilege(
    screen: SystemScreensEnum,
    privilege: SystemPrivilegesEnum,
  ): Observable<void> {
    const path = `/users/privilege?screenId=${screen}&privilegeId=${privilege}`;
    return this.httpRequestsService.get(path).pipe(map(() => {}));
  }
}
