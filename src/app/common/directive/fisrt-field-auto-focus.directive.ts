import { AfterViewInit, Directive, ElementRef, input, InputSignal, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appFisrtFieldAutoFocus]'
})
export class FisrtFieldAutoFocusDirective implements OnChanges, AfterViewInit {
  object: InputSignal<any> = input();

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    })

  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }

}
