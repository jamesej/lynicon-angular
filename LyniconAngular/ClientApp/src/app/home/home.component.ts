import { Component, Injector } from '@angular/core';
import { HomeContent } from './home.content';
import { FromContent, IContentAwareComponent } from '../lynicon-content';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements IContentAwareComponent {
  @FromContent()
  content: HomeContent;

  constructor(public injector: Injector) {
    
  }
}
