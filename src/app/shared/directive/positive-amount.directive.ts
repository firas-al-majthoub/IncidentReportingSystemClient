import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPositiveAmount]',
  standalone: true,
})
export class PositiveAmountDirective {
  // Block manual keystrokes
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const invalidChars = ['e', 'E', '+', '-'];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  // Block pasted values containing invalid characters
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    // RegEx ensures the pasted string contains ONLY positive digits
    if (!/^\d+$/.test(pastedText)) {
      event.preventDefault();
    }
  }
}
