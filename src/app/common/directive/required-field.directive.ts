import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRequiredField]'
})
export class RequiredFieldDirective implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      let element: any = this.elementRef.nativeElement as HTMLElement;
      let innerHTML: string = element.innerHTML;
      this.renderer.setProperty(element, "innerHTML", `${innerHTML} (*)`);
    }, 10)
  }
}
