import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const initialValue = this.el.nativeElement.value;
    const newValue = initialValue.replace(/[^0-9]*/g, '');
    if (initialValue !== newValue) {
      this.el.nativeElement.value = newValue;
      event.stopPropagation();
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    if (event.clipboardData) {
      const pastedInput = event.clipboardData.getData('text/plain').replace(/[^0-9]*/g, '');
      document.execCommand('insertText', false, pastedInput);
    }
  }
}
