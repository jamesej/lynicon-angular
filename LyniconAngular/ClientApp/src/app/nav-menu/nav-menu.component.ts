import { Component, OnInit } from '@angular/core';
import { FetchContentService } from '../lynicon-content';
import { ItemSummary } from './item-summary.content';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  items: ItemSummary[] = [];

  constructor(private fetchContent: FetchContentService) {
  }

  ngOnInit() {
    this.fetchContent.getContentItems<ItemSummary>("/items").subscribe((items) => this.items = items);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
