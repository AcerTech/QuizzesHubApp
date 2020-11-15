import { Component, OnInit, OnDestroy } from '@angular/core';
import { Quiz, Grade, Subject, Question, Book } from 'src/app/interfaces';
import { LoadingController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { QuizesService } from '../../services/quizes.service';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import * as _ from "lodash";
import { Router, NavigationExtras } from '@angular/router';
import { BooksService, LoadingService } from 'src/app/services/index';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-quizes-list',
  templateUrl: './quizes-list.component.html',
  styleUrls: ['./quizes-list.component.scss'],
})
export class QuizesListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  book: Book;
  questionsList: Question[] = []
  // gradesList: Grade[] = []
  // subjectsList: Subject[] = []
  sub: Subscription;
  errorMsg: any;
  defaultBookId: String;


  chaptersGroupedList: any[] = []
  quizesGroupedList: any[] = []

  constructor(
    // private fb: FormBuilder,
    private bookService: BooksService,
    private questionsService: QuestionsService,
    private quizService: QuizesService,
    private router: Router,
    private storage: Storage,
    public loading: LoadingService
  ) {

    if (this.router.getCurrentNavigation().extras.state) {
      this.book = this.router.getCurrentNavigation().extras.state.book;
      this.getAllBookQuestions()
    } else {
      this.router.navigate(['/'])
    }
  }



  async ngOnInit() {

  }




  // async onBookChange(selectedBook) {
  //   this.questionsList = []
  //   this.quizesGroupedList = []
  //   this.chaptersGroupedList = []

  //   if (selectedBook) {
  //     this.storage.set("bookId", selectedBook.detail.value)
  //     this.defaultBookId = selectedBook.detail.value;
  //     this.getAllBookQuestions()
  //   }
  // }



  getAllBookQuestions() {
    this.sub = this.questionsService.getAllBookQuestions(this.book._id).subscribe(
      data => {
        this.questionsList = data
      }, (err: any) => {
        this.errorMsg = err
      },
      () => {
        this.getQuizList()
      }
    )
  }



  ngOnDestroy() {
    if (!this.sub) return;
    this.sub.unsubscribe();
  }

  onSelecteQuiz(selectedQuiz) {
    // console.log(selectedQuiz)
    // this.navCtrl.navigateForward('/quiz-details/')
    let navExtras: NavigationExtras = {
      state: {
        quiz: selectedQuiz
      }
    }
    this.router.navigate(['quiz-details'], navExtras)
  }

  getQuizList() {

    // this.chaptersGroupedList = _.chain(this.questionsList)
    //   .groupBy("chapter.name")
    //   .map((value, key) => ({ chapter: key, quizes: value }))
    //   .value()
    // console.log("1", this.chaptersGroupedList)

    this.chaptersGroupedList = _.chain(this.questionsList)
      .groupBy("chapter.name")
      .map((value, key) => ({ chapter: key, quizes: _.chain(value).groupBy("quiz.name").map((value, key) => ({ quiz: key, questions: value })).value() }))
      .value()

    console.log("2", this.chaptersGroupedList)


    // const merged = this.questionsList.reduce((acc, { quiz, ...rest }) => {
    //   acc[quiz._id] = acc[quiz._id] || { quiz, questions: [] };
    //   acc[quiz._id].questions.push(rest);
    //   return acc;
    // }, {})

    // console.log(Object.values(merged))




    // const result = _(this.questionsList)
    //   .groupBy('chapter._id')
    //   .map(group => ({
    //     chapter: _.head(group).chapter,
    //     quiz: _.map(group, o => _.omit(o, 'quiz'))
    //   }))
    //   .value()

    // console.log(result)

    // const arr = _.groupBy(this.questionsList, (item) => {
    //   return [item.chapter.name, item.quiz.name];
    // });

    // console.log(arr)
  }






}
