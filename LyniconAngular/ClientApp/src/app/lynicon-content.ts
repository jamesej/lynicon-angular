import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

// Fetch content objects from CMS routes
@Injectable()
export class FetchContentService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
  }

  // Get a single content item from a CMS-managed path
  getContent<T>(path: string) : Observable<T> {
    return this.http.get<T>(this.baseUrl + path, {
      headers: { Accept: 'application/json' }
    });
  }

  // Get a list of content items from a CMS-managed path
  getContentItems<T>(path: string) : Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl + path, {
      headers: { Accept: 'application/json' }
    })
  }

  // Test whether a path should be shown with a content editor, taking into if logged in as editor
  isContentPath(path: string) : Observable<boolean> {
    return this.http.get(this.baseUrl + path + "?$mode=ping", {responseType: "text"})
      .pipe(
        map((v, i) => {
          return (v == "OK");
        }),
        catchError((err, caught) => {
          console.log(err);
          return of(false);
        })
      );
  }
}

import { Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, 
    CanActivate, CanActivateChild} from '@angular/router';
import 'rxjs/add/operator/map';

// Cancels router navigation where we need to show a content editor,
// requiring the top browser frame to relocate to the desired url,
// allowing the CMS to build the editor
@Injectable()
export class BypassActivate implements CanActivate, CanActivateChild {
  constructor(private fetchContent: FetchContentService) {}
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    let url = "/" + route.url.join('/');
    if (window.location.pathname != url) {
      let testContentPath = this.fetchContent.isContentPath(url);
      testContentPath.subscribe(isContentPath => {
          if (isContentPath) {
            window.top.location.href = url;
          }
        }
      );
      return testContentPath.map((isContentPath, i) => !isContentPath);
    }
    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.canActivate(route, state);
  }
}

import 'rxjs/add/operator/catch';

// Route resolver which fetches content data to be picked up by the target component
@Injectable()
export class ContentResolver implements Resolve<Observable<object>> {
  constructor(private fetchContent: FetchContentService, private router: Router) {}
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<object> {
    let url = route.url.join('/');
    console.log('Resolving route to ' + url);
    return this.fetchContent.getContent<object>(url)
      .catch(err => { return of(new route.data['contentType']); });
  }
}

import { Injector } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

// To allow use of @FromContent, implement this interface on a component
export interface IContentAwareComponent {
    injector: Injector;
    ngOnInit?: Function;
  }

// Property decorator for use on IContentAwareComponent, automatically initialises
// the property with the content data fetched while routing
export function FromContent() {
    return (classProto: IContentAwareComponent, prop) => {
        const ngOnInitOriginal = classProto.ngOnInit;
        classProto.ngOnInit = function(this: IContentAwareComponent) {
            const route: ActivatedRoute = this.injector.get(ActivatedRoute);
            route.data.subscribe((data: { content: object }) => {
                this[prop] = data.content;
            });
            if (ngOnInitOriginal) {
                return ngOnInitOriginal.call(this);
            }
        };
    };
}