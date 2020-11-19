import { ActionReducer } from "@ngrx/store";
import { Event } from "./event";

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
