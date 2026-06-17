import { Component, Signal } from '@angular/core';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `@if (isVisible()) {
    <div
      class="fixed inset-0 z-9999 flex items-center justify-center bg-white/70 dark:bg-boxdark/70"
    >
      <div
        class="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
      ></div>
    </div>
  }`,
})
export class LoadingSpinnerComponent {
  isVisible: Signal<boolean | undefined>;

  constructor(private loadingSpinnerService: LoadingSpinnerService) {
    this.isVisible = toSignal(this.loadingSpinnerService.isVisible$);
  }
}
