import { createSelector } from "@ngrx/store";
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { BookModel, calculateBooksGrossEarnings } from "src/app/shared/models";
import { BooksEventTypes, BooksApiEventTypes } from "src/app/books/actions";
import { createEventReducer, when, Event } from "src/app/event-store";

export interface State extends EntityState<BookModel> {
  activeBookId: string | null;
}

export const adapter = createEntityAdapter<BookModel>();

export const initialState = adapter.getInitialState({
  activeBookId: null,
}) as State;

export const booksReducer = createEventReducer(
  initialState,
  when(BooksEventTypes.selectBook, (state, action) => {
    return {
      ...state,
      activeBookId: action.bookId,
    } as State;
  }),
  // Note: This could have been merged in to one by writin up our createEventReducer to support multiple
  // event params to match the original ngrx style. I was lazy and implemented it to take an array
  when([BooksEventTypes.clearSelectedBook, BooksEventTypes.enter], state => {
    return {
      ...state,
      activeBookId: null,
    } as State;
  }),
  when(BooksApiEventTypes.booksLoadedSuccess, (state, action) => {
    return adapter.addAll(
      action.books,
      state as EntityState<BookModel>
    ) as State;
  }),
  when(BooksApiEventTypes.bookCreated, (state, action) => {
    return adapter.addOne(action.book, {
      ...state,
      activeBookId: null,
    } as State);
  }),
  when(BooksApiEventTypes.bookUpdated, (state, action) => {
    return adapter.updateOne({ id: action.book.id, changes: action.book }, {
      ...state,
      activeBookId: null,
    } as State) as State;
  }),
  when(BooksApiEventTypes.bookDeleted, (state, action) => {
    return adapter.removeOne(
      action.bookId,
      state as EntityState<BookModel>
    ) as State;
  })
);

export function reducer(state: State | undefined, action: Event) {
  return booksReducer(state, action);
}

export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;
export const selectActiveBook = createSelector(
  selectEntities,
  selectActiveBookId,
  (booksEntities, activeBookId) => {
    return activeBookId ? booksEntities[activeBookId]! : null;
  }
);
export const selectEarningsTotals = createSelector(
  selectAll,
  calculateBooksGrossEarnings
);
