import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  private newToastSubject = new ReplaySubject<Toast>(1);
  newToast$: Observable<Toast> = this.newToastSubject.asObservable();

  showSuccess(title: string, message = '') {
    const toastId = 'placeholder';
    const toast = new Toast(toastId, 'success', title, message);
    this.newToastSubject.next(toast);
  }

  showError(title: string, message = '') {
    const toastId = 'placeholder';
    const toast = new Toast(toastId, 'error', title, message);
    this.newToastSubject.next(toast);
  }
}

export class Toast {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info' = 'info';
  title: string;
  message = '';

  constructor(
    id: string,
    variant: 'success' | 'error' | 'warning' | 'info' = 'info',
    title: string,
    message = '',
  ) {
    this.id = id;
    this.variant = variant;
    this.title = title;
    this.message = message;
  }
}
