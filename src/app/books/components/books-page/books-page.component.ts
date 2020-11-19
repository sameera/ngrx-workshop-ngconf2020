import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  State,
  selectAllBooks,
  selectActiveBook,
  selectBooksEarningsTotals,
} from "src/app/shared/state";
import { BookModel, BookRequiredProps } from "src/app/shared/models";
import { BooksEventTypes } from "../../actions";
import { EventStore } from "src/app/event-store/store";

const BOOKS_PAGE = "Books Page";

@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"],
})
export class BooksPageComponent implements OnInit {
  books$: Observable<BookModel[]>;
  currentBook$: Observable<BookModel | null>;
  total$: Observable<number>;

  constructor(private store: EventStore<State>) {
    this.books$ = store.select(selectAllBooks);
    this.currentBook$ = store.select(selectActiveBook);
    this.total$ = store.select(selectBooksEarningsTotals);
  }

  ngOnInit() {
    this.store.dispatch(BOOKS_PAGE, BooksEventTypes.enter);
  }

  onSelect(book: BookModel) {
    this.store.dispatch(BOOKS_PAGE, BooksEventTypes.selectBook, {
      bookId: book.id,
    });
  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    this.store.dispatch(BOOKS_PAGE, BooksEventTypes.clearSelectedBook);
  }

  onSave(book: BookRequiredProps | BookModel) {
    if ("id" in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    this.store.dispatch(BOOKS_PAGE, BooksEventTypes.createBook, {
      book: bookProps,
    });
  }

  updateBook(book: BookModel) {
    this.store.dispatch(BOOKS_PAGE, BooksEventTypes.updateBook, {
      bookId: book.id,
      changes: book,
    });
  }

  onDelete(book: BookModel) {
    this.store.dispatch(BOOKS_PAGE, BooksEventTypes.deleteBook, {
      bookId: book.id,
    });
  }
}
