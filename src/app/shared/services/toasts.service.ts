import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastsService {
  private readonly TOAST_DISPLAY_TIME = 3000;

  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  showSuccess(title: string, message = '') {
    const toast = new Toast('success', title, message);
    this.showToast(toast);
  }

  showError(title: string, message = '') {
    const toast = new Toast('error', title, message);
    this.showToast(toast);
  }

  private showToast(toast: Toast) {
    this.toasts.push(toast);
    this.toastsSubject.next(this.toasts);

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t != toast);
      this.toastsSubject.next(this.toasts);
    }, this.TOAST_DISPLAY_TIME);
  }
}

export class Toast {
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message = '';

  constructor(
    variant: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message = '',
  ) {
    this.variant = variant;
    this.title = title;
    this.message = message;
  }
}
