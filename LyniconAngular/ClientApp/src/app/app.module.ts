import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { ItemComponent } from './item/item.component';

import { ContentResolver, FetchContentService,BypassActivate } from './lynicon-content';

import { HomeContent } from './home/home.content';
import { CounterContent } from './counter/counter.content';
import { ItemContent } from './item/item.content';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    ItemComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', canActivateChild: [ BypassActivate ], children: [
        { path: '', component: HomeComponent, pathMatch: 'full', resolve: { content: ContentResolver }, data: { contentType: HomeContent } },
        { path: 'counter', component: CounterComponent, resolve: { content: ContentResolver}, data: { contentType: CounterContent} },
        { path: 'fetch-data', component: FetchDataComponent },
        { path: 'item/:name', component: ItemComponent, resolve: { content: ContentResolver}, data: { contentType: ItemContent } }
      ]}
    ])
  ],
  providers: [ContentResolver, FetchContentService, BypassActivate],
  bootstrap: [AppComponent]
})
export class AppModule { }
