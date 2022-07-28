import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[focus]'
})
export class FocusDirective implements OnInit {

  constructor(private hostElement:ElementRef) { }

  @Input() focus!:boolean

  ngOnInit(): void {
    if (this.focus) this.hostElement.nativeElement.focus()
  }
}
