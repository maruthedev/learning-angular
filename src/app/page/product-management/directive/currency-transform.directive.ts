import { Directive, ElementRef, input, InputSignal, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCurrencyTransform]'
})
export class CurrencyTransformDirective implements OnChanges{
  active: InputSignal<boolean> = input(false);
  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.active()? () => {
      this.elementRef.nativeElement.innerText = transformCurrency(this.elementRef);
    } : () => {}
  }
}

export function transformCurrency(elementRef: ElementRef, currencyType?: string): string{
  let type = '$';
  let amount = elementRef.nativeElement.innerText;
  return type + amount;
}