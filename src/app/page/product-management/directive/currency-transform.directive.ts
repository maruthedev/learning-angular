import { AfterContentInit, AfterViewChecked, AfterViewInit, Directive, ElementRef, HostBinding, HostListener, input, InputSignal, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCurrencyTransform]'
})
export class CurrencyTransformDirective implements OnChanges{
  activeProduct: InputSignal<string> = input('');
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    setTimeout(() => {
      this.onBlur();
    }, 10);
  }

  @HostListener("blur")
  onBlur(): void {
    let element = this.elementRef.nativeElement;
    element.type = "text";
    this.renderer.setProperty(element, "value", `$${element.value}`);
  }

  @HostListener("focus")
  onFocus(): void {
    let element = this.elementRef.nativeElement;
    let value: string = element.value as string;
    element.type = "number";
    this.renderer.setProperty(element, "value", value.replaceAll("$", ""));
  }
}