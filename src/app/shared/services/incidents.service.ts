import { Injectable } from '@angular/core';
import { ReportIncidentDto } from '../dto/incident/report-incident.dto';
import { map, Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  public reportIncident(incident: ReportIncidentDto): Observable<void> {
    const apiPath = `/incidents`;
    return this.httpRequestsService.post(apiPath, incident).pipe(map(() => {}));
  }
}
