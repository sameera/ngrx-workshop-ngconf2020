import { Injectable } from "@angular/core";
import { createEffect, Actions } from "@ngrx/effects";
import { mergeMap, map, exhaustMap, concatMap } from "rxjs/operators";
import { args, createEvent, onEvent } from "../event-store";
import { BookModel } from "../shared/models";
import { BooksService } from "../shared/services";
import { BooksApiEventTypes, BooksEventTypes } from "./actions";

const BOOKS_API = "Books API";
const booksLoaded = createEvent(
  BOOKS_API,
  BooksApiEventTypes.booksLoadedSuccess,
  args<{ books: BookModel[] }>()
);
const bookCreated = createEvent(
  BOOKS_API,
  BooksApiEventTypes.bookCreated,
  args<{ book: BookModel }>()
);
const bookUpdated = createEvent(
  BOOKS_API,
  BooksApiEventTypes.bookUpdated,
  args<{ book: BookModel }>()
);
const bookDeleted = createEvent(
  BOOKS_API,
  BooksApiEventTypes.bookDeleted,
  args<{ bookId: string }>()
);

@Injectable()
export class BooksApiEffects {
  constructor(private booksService: BooksService, private actions$: Actions) {}

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      onEvent(BooksEventTypes.enter),
      exhaustMap(() =>
        this.booksService.all().pipe(map((books) => booksLoaded({ books })))
      )
    )
  );

  createBook$ = createEffect(() =>
    this.actions$.pipe(
      onEvent(BooksEventTypes.createBook),
      concatMap((action) =>
        this.booksService
          .create(action.book)
          .pipe(map((book) => bookCreated({ book })))
      )
    )
  );

  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      onEvent(BooksEventTypes.updateBook),
      concatMap((action) =>
        this.booksService
          .update(action.bookId, action.changes)
          .pipe(map((book) => bookUpdated({ book })))
      )
    )
  );

  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      onEvent(BooksEventTypes.deleteBook),
      mergeMap((action) =>
        this.booksService
          .delete(action.bookId)
          .pipe(map(() => bookDeleted({ bookId: action.bookId })))
      )
    )
  );
}
