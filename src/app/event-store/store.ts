import {
  Action,
  Store,
  StateObservable,
  ActionsSubject,
  ReducerManager,
} from "@ngrx/store";
import { Injectable } from "@angular/core";
import { Event, toEvent } from "./event";

@Injectable({ providedIn: "root" })
export class EventStore<StateType> extends Store<StateType> {
  constructor(
    state$: StateObservable,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager
  ) {
    super(state$, actionsObserver, reducerManager);
  }

  public dispatch(event: Action): void;
  public dispatch<VerbType extends string>(
    source: string,
    verb: VerbType
  ): void;
  public dispatch<VerbType extends string>(
    source: string,
    verb: VerbType,
    args: any
  ): void;
  public dispatch<VerbType extends string>(
    sourceOrEvent: string | Action,
    verb?: VerbType,
    args?: any
  ): void {
    if (typeof args !== "undefined") {
      super.dispatch({
        ...toEvent(sourceOrEvent as string, verb as string),
        ...args,
      });
    } else if (typeof verb !== "undefined") {
      super.dispatch(toEvent(sourceOrEvent as string, verb));
    } else {
      super.dispatch(sourceOrEvent as Action);
    }
  }
}
