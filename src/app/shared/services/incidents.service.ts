import { Injectable } from '@angular/core';
import { ReportIncidentDto } from '../dto/incident/report-incident.dto';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncidentsService {
  private apiBaseUrl = 'https://localhost:7090';

  constructor(private http: HttpClient) {}

  public reportIncident(
    incident: ReportIncidentDto,
  ): Observable<void> {
    const url = `${this.apiBaseUrl}/incidents`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<string>(url, incident, { headers }).pipe(
      map((response: string) => {
        console.log(`response inside service:`);
        console.log(response);
      }),
      catchError((err: HttpErrorResponse) => {
        
        console.log(`err inside service:`);
        console.log(err);
        return throwError(() => {
          return err.message;
        });
      }),
    );
  }
}
