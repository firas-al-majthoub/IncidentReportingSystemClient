import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService {
  private readonly isProcessing$;

  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  isVisible$: Observable<boolean> = this.isVisibleSubject.asObservable();

  constructor(private httpRequestsService: HttpRequestsService) {
    this.isProcessing$ = this.httpRequestsService.isProcessing$;

    this.isProcessing$.subscribe({
      next: (val: boolean) => {
        this.isVisibleSubject.next(val);
      },
    });
  }
}
