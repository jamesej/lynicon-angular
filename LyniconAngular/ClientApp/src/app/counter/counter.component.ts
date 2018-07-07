import { Component, Injector } from '@angular/core';
import { CounterContent } from './counter.content';
import { FromContent, IContentAwareComponent } from '../lynicon-content';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent implements IContentAwareComponent {
  @FromContent()
  content: CounterContent;

  constructor(public injector: Injector) {
  }

  public currentCount = 0;

  public incrementCounter() {
    this.currentCount++;
  }
}
