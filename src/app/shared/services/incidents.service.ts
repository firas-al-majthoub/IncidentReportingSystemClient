import { Injectable } from '@angular/core';
import { ReportIncidentDto } from '../data/dto/report-incident.dto';
import { map, Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';
import { AllIncidentsDto } from '../data/dto/all-incidents.dto';
import { SearchIncidentsOrderByEnum } from '../data/enum/search-incidents-order-by.enum';
import { Incident } from '../data/model/incident';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  reportIncident(incident: ReportIncidentDto): Observable<void> {
    const apiPath = `/incidents`;
    return this.httpRequestsService.post(apiPath, incident).pipe(map(() => {}));
  }

  getIncidents(
    itemsPerPage: number,
    currentPage: number,
    orderBy: SearchIncidentsOrderByEnum,
    orderAscending: boolean,
  ): Observable<AllIncidentsDto> {
    const apiPath = `/incidents/search`;
    const dto = {
      itemsPerPage,
      currentPage,
      orderBy,
      orderAscending,
    };

    return this.httpRequestsService.post<AllIncidentsDto>(apiPath, dto);
  }

  getIncidentDetails(id: number): Observable<Incident> {
    const apiPath = `/incidents/${id}`;
    return this.httpRequestsService.get(apiPath);
  }
}
