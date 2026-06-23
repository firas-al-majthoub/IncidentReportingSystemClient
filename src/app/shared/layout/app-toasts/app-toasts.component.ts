import { Component } from '@angular/core';
import { AlertComponent } from '../../components/ui/alert/alert.component';
import { Toast, ToastsService } from '../../services/toasts.service';

@Component({
  selector: 'app-toasts',
  imports: [AlertComponent],
  template: `<div class="fixed top-24 right-4 z-999999 space-y-2 justify-items-end">
    @for (toast of toasts; track toast.id) {
      <div>
        <app-alert
          [variant]="toast.variant"
          [title]="toast.title"
          [message]="toast.message"
        />
      </div>
    }
  </div>`,
})
export class ToastsLayoutComponent {
  toasts: Toast[] = [];
  readonly newToast$;

  constructor(private toastsService: ToastsService) {
    this.newToast$ = this.toastsService.newToast$;
    this.newToast$.subscribe((toast) => {
      this.toasts.push(toast);

      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t != toast);
      }, 3000);
    });
  }
}
