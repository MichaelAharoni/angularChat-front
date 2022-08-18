import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[closeAfter]'
})
export class CloseAfterDirective {

  @Input() closeAfter! : number

  constructor() { }

}
