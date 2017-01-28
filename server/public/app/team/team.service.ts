import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
//
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class TeamService {

  private baseUrl = 'http://localhost:9659';


  constructor(private http: Http) {}

  getRepos(): Observable<any[]> {
    let url = `${this.baseUrl}/repos`;

    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUsers(repoName: string): Observable<any[]> {
    let url = `${this.baseUrl}/users/${repoName}`;

    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
