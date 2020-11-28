import { ActionReducer } from "@ngrx/store";

import { Event } from "./event";
import { EventAssembler, VerbedEvent } from "./event-creators";

export type EventReducer<StateType> = (
  state: StateType,
  event: Event
) => StateType;

export interface When<StateType, EventType extends Event = Event> {
  reducer: ActionReducer<StateType, EventType>;
  verbs: string[];
}

export function when<StateType, EventType extends Event = Event>(
  verb: string,
  reducer: ActionReducer<StateType, EventType>
): When<StateType, EventType>;
export function when<StateType, ArgsType, EventType extends Event = Event>(
  event: EventAssembler<ArgsType>,
  reducer: ActionReducer<StateType, EventType>
): When<StateType, EventType>;
export function when<StateType, ArgsType, EventType extends Event = Event>(
  event: (string | EventAssembler<ArgsType>)[],
  reducer: ActionReducer<StateType, EventType>
): When<StateType, EventType>;
export function when<StateType, ArgsType, EventType extends Event = Event>(
  verbOrPreparedEvent:
    | string
    | EventAssembler<ArgsType>
    | (string | EventAssembler<ArgsType>)[],
  // prettier-ignore
  reducer: ActionReducer<StateType, Event> | ActionReducer<StateType, EventType>
): When<StateType, EventType> {
  const verbs = getVerbs(verbOrPreparedEvent);
  return {
    reducer,
    verbs,
  };
}

function getVerbs<ArgsType>(
  param:
    | string
    | EventAssembler<ArgsType>
    | (string | EventAssembler<ArgsType>)[]
): string[] {
  if (typeof param === "string") return [param];
  if (((param as unknown) as VerbedEvent).verb)
    return [((param as unknown) as VerbedEvent).verb];

  if (Array.isArray(param)) {
    return param.map((p: string | EventAssembler<ArgsType>) =>
      typeof p === "string" ? p : ((p as unknown) as VerbedEvent).verb
    );
  }

  throw new Error("Incompatible event type");
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
