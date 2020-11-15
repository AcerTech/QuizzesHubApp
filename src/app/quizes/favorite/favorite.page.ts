import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Book } from 'src/app/interfaces';
const refresher = document.getElementById('refresher');
@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  favoriteBooks: Book[] = [];
  errorMsg: any;

  constructor(private storage: Storage,
    private router: Router,) { }

  ngOnInit() {

    this.getMyFavoriteBooks();
  }


  getMyFavoriteBooks() {
    this.favoriteBooks = []
    this.storage.get('myFavoriteBooks').then((val) => {
      if (!val) return;
      // console.log('my Favorite Books', val);
      this.favoriteBooks = val
    });
  }

  doRefresh(event) {
    this.getMyFavoriteBooks()
    setTimeout(() => {
      event.target.complete();
    }, 300)
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

  onRemoveClicked(book) {
    const index: number = this.favoriteBooks.indexOf(book);
    if (index !== -1) {
      this.favoriteBooks.splice(index, 1);
      this.storage.set("myFavoriteBooks", this.favoriteBooks)
    }
  }

}
