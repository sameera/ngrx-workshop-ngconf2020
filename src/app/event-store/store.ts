import { Injectable } from "@angular/core";
import { Action, ActionsSubject, ReducerManager, StateObservable, Store } from "@ngrx/store";

import { toEvent } from "./event-creators";

@Injectable({ providedIn: "root" })
export class EventStore<StateType> extends Store<StateType> {
    constructor(state$: StateObservable, actionsObserver: ActionsSubject, reducerManager: ReducerManager) {
        super(state$, actionsObserver, reducerManager);
    }

    public dispatch(event: Action): void;
    public dispatch(source: string, verb: string, args?: object): void;
    public dispatch(sourceOrEvent: string | Action, verb?: string, args?: object): void {
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
