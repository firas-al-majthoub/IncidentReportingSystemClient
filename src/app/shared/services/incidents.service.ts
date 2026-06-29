import { Injectable } from '@angular/core';
import { ReportIncidentDto } from '../data/dto/report-incident.dto';
import { map, Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';
import { AllIncidentsDto } from '../data/dto/all-incidents.dto';
import { Incident } from '../data/model/incident';
import { CloseIncidentDto } from '../data/dto/close-incident.dto';
import { ReturnIncidentDto } from '../data/dto/return-incident.dto';
import { UpdateIncidentDto } from '../data/dto/update-incident.dto';
import { SearcIincidentsDto } from '../data/dto/search-incidents.dto';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  reportIncident(dto: ReportIncidentDto): Observable<void> {
    const apiPath = `/incidents`;
    return this.httpRequestsService.post(apiPath, dto).pipe(map(() => {}));
  }

  searchIncidents(dto: SearcIincidentsDto): Observable<AllIncidentsDto> {
    const apiPath = `/incidents/search`;
    return this.httpRequestsService.post<AllIncidentsDto>(apiPath, dto);
  }

  getIncidentDetails(id: number): Observable<Incident> {
    const apiPath = `/incidents/${id}`;
    return this.httpRequestsService.get(apiPath);
  }

  closeIncident(dto: CloseIncidentDto): Observable<void> {
    const apiPath = `/incidents/close`;
    return this.httpRequestsService.post(apiPath, dto).pipe(map(() => {}));
  }

  returnIncident(dto: ReturnIncidentDto): Observable<void> {
    const apiPath = `/incidents/return`;
    return this.httpRequestsService.post(apiPath, dto).pipe(map(() => {}));
  }

  updateIncident(dto: UpdateIncidentDto): Observable<void> {
    const apiPath = `/incidents`;
    return this.httpRequestsService.patch(apiPath, dto).pipe(map(() => {}));
  }

  getMyReturnedIncidents() {
    const apiPath = `/incidents/my-returned-incidents`;
    return this.httpRequestsService.get<Incident[]>(apiPath);
  }
}
