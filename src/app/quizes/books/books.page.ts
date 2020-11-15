import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Book } from 'src/app/interfaces';
import { BooksService, LoadingService } from 'src/app/services';
import { Storage } from '@ionic/storage';
import * as _ from "lodash";

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit, OnDestroy {
  sub: Subscription;
  books: Book[] = [];
  favoriteBooks: Book[] = [];
  errorMsg: any;
  favorited: boolean = false;
  searchTerm: string = "";

  constructor(
    private bookService: BooksService,
    private router: Router,
    public loading: LoadingService,
    private storage: Storage,
  ) { }

  async ngOnInit() {
    await this.getBooks();
    this.getMyFavoriteBooks();
  }

  async getBooks() {
    this.loading.present();
    this.sub = await this.bookService.getBooks().subscribe(
      data => {
        this.books = data;
      }, (err: any) => {
        this.loading.dismiss();
        this.errorMsg = err
      }, () => {
        this.loading.dismiss();
        // console.log(this.books)
        // this.onBookChange(this.defaultBookId)
      }
    )
  }

  getMyFavoriteBooks() {
    this.storage.get('myFavoriteBooks').then((val) => {
      if (!val) return;
      console.log('my Favorite Books', val);
      this.favoriteBooks = val
    });
  }

  checkSerchTerm() {
    if (!this.searchTerm && !this.books) {
      console.log('search is null')
      this.getBooks();
    }
  }

  async executeSearch() {
    if (!this.searchTerm) {
      this.getBooks();
      return;
    }
    this.loading.present();
    this.sub = await this.bookService.search(this.searchTerm).subscribe(
      data => {
        this.books = data;
      }, (err: any) => {
        this.loading.dismiss();
        this.errorMsg = err
      }, () => {
        this.loading.dismiss();
        // console.log(this.books)
        // this.onBookChange(this.defaultBookId)
      }
    )
  }

  onBookClicked(selectedBook) {
    // console.log(selectedBook)
    if (selectedBook) {
      this.storage.set("book", selectedBook)
    }

    let navExtras: NavigationExtras = {
      state: {
        book: selectedBook
      }
    }
    this.router.navigate(['quizes-list'], navExtras)
  }

  onFavoriteClicked(book) {
    var b = _.find(this.favoriteBooks, { _id: book._id })
    if (b) {
      _.remove(this.favoriteBooks, { _id: book._id })
      this.storage.set("myFavoriteBooks", this.favoriteBooks)
      return;
    }

    this.favoriteBooks.push(book)
    this.storage.set("myFavoriteBooks", this.favoriteBooks)
  }

  checkIfBookInFavorite(book) {
    // const index: number = this.favoriteBooks.indexOf(book);
    var b = _.find(this.favoriteBooks, { _id: book._id })
    if (!b) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    if (!this.sub) return;
    this.sub.unsubscribe();
  }

}
