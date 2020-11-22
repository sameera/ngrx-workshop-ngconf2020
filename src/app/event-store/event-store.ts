import { EMPTY, of, OperatorFunction } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import {
  Action,
  ActionReducer,
  Store,
  StateObservable,
  ActionsSubject,
  ReducerManager,
} from "@ngrx/store";
import { Injectable } from "@angular/core";

export interface Event<VerbType extends string = string> extends Action {
  readonly verb: VerbType;
  readonly source: string;
  [other: string]: any;
}

export function args<T>() {
  return ("args" as any) as T;
}

export type EventCreator = () => Event;
export type EventCreatorWithParam<P> = (param: P) => Event;

export type EventAssembler = (source: string) => Event;
export type EventAssemblerWithParam<P> = (source: string, param: P) => Event;

export function toEvent(source: string, verb: string): Event {
  return {
    verb,
    source,
    type: `[${source}] ${verb}`,
  };
}

export function createEvent(source: string, verb: string): EventCreator;
export function createEvent<P>(
  source: string,
  verb: string,
  config: P
): EventCreatorWithParam<P>;
export function createEvent<P>(
  source: string,
  verb: string,
  config?: P
): EventCreator | EventCreatorWithParam<P> {
  if (!config) return () => toEvent(source, verb);

  return (prop: P) => ({
    ...prop,
    verb,
    source,
    type: `[${source}] ${verb}`,
  });
}

export function prepareEvent(verb: string): EventAssembler;
export function prepareEvent<P>(
  verb: string,
  config: P
): EventAssemblerWithParam<P>;
export function prepareEvent<VerbType extends string, P>(
  verb: VerbType,
  config?: P
): EventAssembler | EventAssemblerWithParam<P> {
  if (!config) {
    return (source: string) => toEvent(source, verb);
  }

  return (source: string, prop: P) => ({
    ...prop,
    verb,
    source,
    type: `[${source}] ${verb}`,
  });
}

export function onEvent<VerbType extends string>(
  expectedEvent: VerbType
): OperatorFunction<Action, Event<VerbType>> {
  return flatMap((action: Action) =>
    (action as Event<VerbType>).verb === expectedEvent
      ? of(action as Event<VerbType>)
      : EMPTY
  );
}

export type EventReducer<StateType> = (
  state: StateType,
  event: Event
) => StateType;

export interface When<StateType> {
  reducer: ActionReducer<StateType, Event>;
  verbs: string[];
}

export function when<StateType>(
  verbs: string[],
  reducer: ActionReducer<StateType, Event>
): When<StateType>;
export function when<StateType>(
  verb: string,
  reducer: ActionReducer<StateType, Event>
): When<StateType>;
export function when<StateType>(
  verbs: string | string[],
  reducer: ActionReducer<StateType, Event>
): When<StateType> {
  return {
    reducer,
    verbs: Array.isArray(verbs) ? verbs : [verbs],
  };
}

export function createEventReducer<StateType>(
  initialState: StateType,
  ...whens: When<StateType>[]
): ActionReducer<StateType, Event> {
  const map = new Map<string, ActionReducer<StateType, Event>>();
  for (let i = whens.length - 1; i >= 0; i--) {
    if (!whens[i]) continue;

    for (let j = whens[i].verbs.length - 1; j >= 0; j--) {
      map.set(whens[i].verbs[j], whens[i].reducer);
    }
  }

  return function (state: StateType = initialState, action: Event): StateType {
    const reducer = map.get(action.verb);
    return reducer ? reducer(state, action) : state;
  };
}

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
