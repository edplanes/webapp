/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[appDurationPicker]',
  standalone: true,
})
export class DurationPickerDirective implements OnChanges {
  private decimalCounter = 0;
  private navigationKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
  @Input() picker: HTMLInputElement;

  constructor(public el: ElementRef) {
    this.picker = el.nativeElement;
    this.picker.value = '01:00';
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (this.navigationKeys.indexOf(e.key) > -1) {
      // let it happen, don't do anything
      return;
    }
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (e.key == 'ArrowDown') {
      e.preventDefault();
      this.decreaseValue(e.target);
    }
    if (e.key == 'ArrowUp') {
      e.preventDefault();
      this.increaseValue(e.target);
    }
    this.validateInput(e);
  }

  @HostListener('change', ['$event']) ngOnChanges(e: unknown) {
    this.validateInput(e);
  }

  @HostListener('click', ['$event']) ngOnClick(e: unknown) {
    this.selectFocus(e);
  }

  insertFormatted = (inputBox: HTMLInputElement, secondsValue: number) => {
    const hours = Math.floor(secondsValue / 3600);
    secondsValue %= 3600;
    const minutes = Math.floor(secondsValue / 60);
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedHours = String(hours).padStart(3, '0');
    inputBox.value = paddedHours + ':' + paddedMinutes;
  };

  increaseValue = (inputBox: any) => {
    const rawValue = inputBox.value;
    const sectioned = rawValue.split(':');
    let secondsValue = 0;

    if (sectioned.length === 2) {
      secondsValue = Number(sectioned[1]) * 60 + Number(sectioned[0]) * 60 * 60;
    }
    secondsValue++;
    this.insertFormatted(inputBox, secondsValue);
  };

  decreaseValue = (inputBox: any) => {
    const rawValue = inputBox.value;
    const sectioned = rawValue.split(':');
    let secondsValue = 0;

    if (sectioned.length === 2) {
      secondsValue = Number(sectioned[1]) * 60 + Number(sectioned[0]) * 60 * 60;
    }
    secondsValue--;
    secondsValue = (secondsValue < 0 && 0) || secondsValue;
    this.insertFormatted(inputBox, secondsValue);
  };

  validateInput = (event: any) => {
    const sectioned = event.target?.value.split(':');
    if (sectioned.length !== 2) {
      event.target.value = '00:00';
      return;
    }

    if (isNaN(sectioned[0])) sectioned[0] = '00';
    if (isNaN(sectioned[1]) || sectioned[1] < 0) sectioned[1] = '00';
    if (sectioned[1] > 59 || sectioned[1].length > 2) sectioned[1] = '59';

    event.target.value = sectioned.join(':');
  };

  selectFocus = (event: any) => {
    const cursorPosition = event.target.selectionStart;
    const hourMarker = event.target.value.indexOf(':');
    const minuteMarker = event.target.value.lastIndexOf(':');

    if (hourMarker < 0 || minuteMarker < 0) {
      return;
    }

    if (cursorPosition > hourMarker) {
      event.target.selectionStart = 0;
      event.target.selectionEnd = hourMarker;
    }
    if (cursorPosition > hourMarker && cursorPosition < minuteMarker) {
      event.target.selectionStart = hourMarker + 1;
      event.target.selectionEnd = minuteMarker;
    }
  };
}
