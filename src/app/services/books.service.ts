import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

import { Book } from '../interfaces';
import { environment } from "../../environments/environment";
const url: string = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  getBooks() {
    return this.http.get(url + "books").pipe(
      map((data: any) => <Book[]>data),
      shareReplay(),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  search(term) {
    const search = {
      searchTerm: term
    }
    return this.http.post(url + "books/search", search).pipe(
      map((data: any) => <Book[]>data),
      shareReplay(),
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    // console.error(error);
    let msg = `Error status code ${error.status} at ${error.error}`;
    return throwError(msg);
  }

}
