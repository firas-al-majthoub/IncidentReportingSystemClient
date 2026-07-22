import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';

@Injectable({
  providedIn: 'root',
})
export class SystemScreensService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  openReportIncident(): Observable<void> {
    const path = '/system-screens/open-report-incident';
    return this.openScreen(path);
  }

  openViewAllIncidents(): Observable<void> {
    const path = '/system-screens/open-view-all-incidents';
    return this.openScreen(path);
  }

  openEditIncident(): Observable<void> {
    const path = '/system-screens/open-edit-incident';
    return this.openScreen(path);
  }

  openIncidentDetails(): Observable<void> {
    const path = '/system-screens/open-incident-details';
    return this.openScreen(path);
  }

  openMyReturnedIncidents(): Observable<void> {
    const path = '/system-screens/open-my-returned-incidents';
    return this.openScreen(path);
  }

  openEditReturnedIncident(): Observable<void> {
    const path = '/system-screens/open-edit-returned-incident';
    return this.openScreen(path);
  }

  openAssignUsersRole(): Observable<void> {
    const path = '/system-screens/open-assign-users-role';
    return this.openScreen(path);
  }

  openEditUserRoles(): Observable<void> {
    const path = '/system-screens/open-edit-user-roles';
    return this.openScreen(path);
  }

  openEditRolePrivileges(): Observable<void> {
    const path = '/system-screens/open-edit-role-privileges';
    return this.openScreen(path);
  }

  private openScreen(path: string): Observable<void> {
    return this.httpRequestsService.get(path).pipe(map(() => {}));
  }
}
