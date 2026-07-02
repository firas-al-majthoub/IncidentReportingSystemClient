import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import { ToastsService } from './toasts.service';
import config from '../../config.json';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestsService {
  private apiBaseUrl = config.ApiBaseUrl;
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
    private toastsService: ToastsService,
  ) {
    this.openReqsCount$.subscribe({
      next: (count: number) => {
        this.isProcessingSubject.next(count != 0);
      },
    });
  }

  get<T>(path: string): Observable<T> {
    return this.sendRequest<T>('GET', path);
  }

  post<T>(path: string, body: any): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.sendRequest<T>('POST', path, headers, body);
  }

  patch<T>(path: string, body: any): Observable<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.sendRequest<T>('PATCH', path, headers, body);
  }

  blobPost(path: string, body: any): Observable<Blob> {
    this.incrementOpenReqs();

    const url = `${this.apiBaseUrl + path}`;
    const token = this.authService.authToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(url, body, { headers, responseType: 'blob' }).pipe(
      tap(() => this.reqSuccess()),
      catchError((err: HttpErrorResponse) => this.reqFailure(err)),
    );
  }

  private sendRequest<T>(
    method: 'GET' | 'POST' | 'PATCH',
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

    if (method == 'PATCH')
      return this.http.patch<T>(url, body, { headers }).pipe(
        tap(() => this.reqSuccess()),
        catchError((err: HttpErrorResponse) => this.reqFailure(err)),
      );

    return this.http.get<T>(url, { headers }).pipe(
      tap(() => this.reqSuccess()),
      catchError((err: HttpErrorResponse) => this.reqFailure(err)),
    );
  }

  private reqSuccess(): void {
    this.decrementOpenReqs();
  }

  private reqFailure(err: HttpErrorResponse): Observable<never> {
    this.decrementOpenReqs();

    if (err.status == 401) {
      this.toastsService.showError('Session ended, please sign in...');
      this.authService.signOut();
      return EMPTY;
    }

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
