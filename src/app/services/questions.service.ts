import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';

import { Question } from '../interfaces';
import { environment } from "../../environments/environment";
const url: string = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http: HttpClient) { }

  getAllBookQuestions(bookId) {

    return this.http.get(url + "questions/bybookid/" + bookId).pipe(
      map((data: any) => <Question[]>data),
      // tap(data => console.log(data)),
      shareReplay(1),
      catchError(this.handleError)
    );

  }


  getAllChaperQuestions(chapterId) {
    return this.http.get(url + "questions/bychapterid/" + chapterId).pipe(
      map((data: any) => <Question[]>data),
      shareReplay(),
      // tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  getAllQuizQuestions(quizId) {
    return this.http.get(url + "questions/byquizid/" + quizId).pipe(
      map((data: any) => <Question[]>data),
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
