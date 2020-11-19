import { ActionReducer, Action, State } from "@ngrx/store";
import { AuthEventTypes } from "src/app/auth/actions";
import { Event } from "../../event-store";

export function logoutMetareducer(reducer: ActionReducer<any, Event>) {
  return function (state: any, action: Event) {
    if (action.verb === AuthEventTypes.logout) {
      return reducer(undefined, action);
    }

    return reducer(state, action);
  };
}
