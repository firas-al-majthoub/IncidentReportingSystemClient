import { Component } from '@angular/core';
import { AlertComponent } from '../../components/ui/alert/alert.component';
import { ToastsService } from '../../services/toasts.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-toasts',
  imports: [AlertComponent],
  template: `<div
    class="fixed top-24 right-4 z-999999 space-y-2 justify-items-end"
  >
    @for (toast of toasts(); track toast) {
      <div>
        <app-alert
          [variant]="toast.variant"
          [title]="toast.title"
          [message]="toast.message"
          [showLink]="false"
        />
      </div>
    }
  </div>`,
})
export class ToastsLayoutComponent {
  toasts: any;

  constructor(private toastsService: ToastsService) {
    this.toasts = toSignal(this.toastsService.toasts$);
  }
}
