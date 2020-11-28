import { Action } from "@ngrx/store";
import { of, EMPTY, OperatorFunction } from "rxjs";
import { flatMap } from "rxjs/operators";

import { Event } from "./event";
import { EventAssembler, VerbedEvent } from "./event-creators";

export function onEvent(verb: string): OperatorFunction<Action, Event>;
export function onEvent<ArgsType>(
    expectedEvent: EventAssembler<ArgsType>
): OperatorFunction<Action, Event>;
export function onEvent<ArgsType>(
    expectedEvenOrVerb: string | EventAssembler<ArgsType>
) {
    const expectedVerb =
        typeof expectedEvenOrVerb === "string"
            ? expectedEvenOrVerb
            : ((expectedEvenOrVerb as any) as VerbedEvent).verb;

    return flatMap((action: Action) =>
        (action as Event).verb === expectedVerb ? of(action as Event) : EMPTY
    );
}
