import { Injectable } from '@angular/core';
import { ReportIncidentDto } from '../data/dto/report-incident.dto';
import { map, Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';
import { SearchIncidentsResDto } from '../data/dto/search-incidents-res.dto';
import { Incident } from '../data/model/incident';
import { CloseIncidentDto } from '../data/dto/close-incident.dto';
import { ReturnIncidentDto } from '../data/dto/return-incident.dto';
import { UpdateReturnedIncidentDto } from '../data/dto/update-returned-incident.dto';
import { SearchIncidentsDto } from '../data/dto/search-incidents.dto';
import { GenerateReportFileDto } from '../data/dto/generate-pdf-file.dto';
import { UpdateIncidentDto } from '../data/dto/update-incident.dto';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  reportIncident(dto: ReportIncidentDto): Observable<void> {
    const apiPath = `/incidents`;
    return this.httpRequestsService.post(apiPath, dto).pipe(map(() => {}));
  }

  searchIncidents(dto: SearchIncidentsDto): Observable<SearchIncidentsResDto> {
    const apiPath = `/incidents/search`;
    return this.httpRequestsService.post<SearchIncidentsResDto>(apiPath, dto);
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

  updateReturnedIncident(dto: UpdateReturnedIncidentDto): Observable<void> {
    const apiPath = `/incidents/update-returned`;
    return this.httpRequestsService.patch(apiPath, dto).pipe(map(() => {}));
  }

  updateIncident(dto: UpdateIncidentDto): Observable<void> {
    const apiPath = `/incidents/update`;
    return this.httpRequestsService.patch(apiPath, dto).pipe(map(() => {}));
  }

  getMyReturnedIncidents(): Observable<Incident[]> {
    const apiPath = `/incidents/my-returned-incidents`;
    return this.httpRequestsService.get<Incident[]>(apiPath);
  }

  generatePdfFile(dto: GenerateReportFileDto): Observable<Blob> {
    const apiPath = `/incidents/generate-pdf`;
    return this.httpRequestsService.blobPost(apiPath, dto);
  }

  generateExcelFile(dto: GenerateReportFileDto): Observable<Blob> {
    const apiPath = `/incidents/generate-excel`;
    return this.httpRequestsService.blobPost(apiPath, dto);
  }
}
