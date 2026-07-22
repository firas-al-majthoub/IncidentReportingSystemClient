import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';

@Injectable({
  providedIn: 'root',
})
export class DdlDataService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  getDepartments(): Observable<DdlItem[]> {
    const apiPath = '/departments';
    return this.httpRequestsService.get<DdlItem[]>(apiPath);
  }

  getIncidentLossTypes(): Observable<DdlItem[]> {
    const apiPath = '/incidents/loss-types';
    return this.httpRequestsService.get<DdlItem[]>(apiPath);
  }

  getIncidentCauses(): Observable<DdlItem[]> {
    const apiPath = '/incidents/causes';
    return this.httpRequestsService.get<DdlItem[]>(apiPath);
  }

  getIncidentSeverities(): Observable<DdlItem[]> {
    const apiPath = '/incidents/severities';
    return this.httpRequestsService.get<DdlItem[]>(apiPath);
  }

  getIncidentStatuses(): Observable<DdlItem[]> {
    const apiPath = '/incidents/statuses';
    return this.httpRequestsService.get<DdlItem[]>(apiPath);
  }

  getSystemPrivileges(): Observable<DdlItem[]> {
    const apiPath = '/system-settings/privileges';
    return this.httpRequestsService.get<DdlItem[]>(apiPath);
  }

  getAssignablePrivilegeSystemScreens(): Observable<DdlItem[]> {
    const apiPath = '/system-settings/assignable-privilege-screens';
    return this.httpRequestsService.get<DdlItem[]>(apiPath);
  }
}

export class DdlItem {
  id: number;
  nameEn: string;
  nameAr: string;

  constructor(id: number, nameEn: string, nameAr: string) {
    this.id = id;
    this.nameEn = nameEn;
    this.nameAr = nameAr;
  }
}
