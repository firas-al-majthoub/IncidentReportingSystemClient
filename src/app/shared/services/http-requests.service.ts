import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

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

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.openReqsCount$.subscribe({
      next: (count: number) => {
        this.isProcessingSubject.next(count != 0);
      },
    });
  }

  post<T>(path: string, body: any): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.sendRequest<T>('POST', path, headers, body);
  }

  get<T>(path: string): Observable<T> {
    return this.sendRequest<T>('GET', path);
  }

  private sendRequest<T>(
    method: 'GET' | 'POST',
    path: string,
    headers?: HttpHeaders,
    body?: any,
  ): Observable<T> {
    this.incrementOpenReqs();

    const url = `${this.apiBaseUrl + path}`;
    const token = this.authService.authToken;
    headers = (headers ?? new HttpHeaders()).append(
      'Authorization',
      `Bearer ${token}`,
    );

    if (method == 'POST')
      return this.http.post<T>(url, body, { headers }).pipe(
        tap(() => this.reqSuccess()),
        catchError((err: HttpErrorResponse) => this.reqFailure(err)),
      );

    return this.http.get<T>(url, { headers }).pipe(
      tap(() => this.reqSuccess()),
      catchError((err: HttpErrorResponse) => this.reqFailure(err)),
    );
  }

  private reqSuccess() {
    this.decrementOpenReqs();
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
