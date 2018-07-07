import { Component, Injector } from '@angular/core';
import { ItemContent } from './item.content';
import { FromContent, IContentAwareComponent } from '../lynicon-content';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
})
export class ItemComponent implements IContentAwareComponent {
  @FromContent()
  content: ItemContent;

  constructor(public injector: Injector) {
    
  }
}
