import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService {
  private apiBaseUrl = 'https://localhost:7090';
  private openReqsCount = 0;

  private isProcessingSubject = new BehaviorSubject<boolean>(false);
  private openReqsCountSubject = new BehaviorSubject<number>(
    this.openReqsCount,
  );

  isProcessing$: Observable<boolean> = this.isProcessingSubject.asObservable();
  private openReqsCount$: Observable<number> =
    this.openReqsCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.openReqsCount$.subscribe({
      next: (count: number) => {
        this.isProcessingSubject.next(count != 0);
      },
    });
  }

  post(path: string, body: any): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.sendRequest('POST', path, headers, body);
  }

  private sendRequest(
    method: 'GET' | 'POST',
    path: string,
    headers?: HttpHeaders,
    body?: any,
  ): Observable<string> {
    this.incrementOpenReqs();

    const url = `${this.apiBaseUrl + path}`;

    if (method == 'POST')
      return this.http.post<string>(url, body, { headers }).pipe(
        map((response: string) => this.reqSuccess(response)),
        catchError((err: HttpErrorResponse) => this.reqFailure(err)),
      );

    return this.http.get(url).pipe(
      map(() => this.reqSuccess()),
      catchError((err: HttpErrorResponse) => this.reqFailure(err)),
    );
  }

  private reqSuccess(response?: string) {
    this.decrementOpenReqs();
    return '';
  }

  private reqFailure(err: HttpErrorResponse) {
    this.decrementOpenReqs();
    return throwError(() => err);
  }

  private incrementOpenReqs() {
    this.openReqsCount++;
    this.openReqsCountSubject.next(this.openReqsCount);
  }

  private decrementOpenReqs() {
    this.openReqsCount--;
    this.openReqsCountSubject.next(this.openReqsCount);
  }
}
