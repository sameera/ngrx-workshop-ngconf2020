// import { EMPTY, of, OperatorFunction } from "rxjs";
// import { Action } from "@ngrx/store";
// import { flatMap, map } from "rxjs/operators";
// import { Event } from "./event";

// export function onEvent<VerbType extends string>(
//   expectedEvent: VerbType
// ): OperatorFunction<Action, Event<VerbType>> {
//   return flatMap((action: Action) =>
//     (action as Event<VerbType>).verb === expectedEvent
//       ? of(action as Event<VerbType>)
//       : EMPTY
//   );
// }
import { EMPTY, of, OperatorFunction } from "rxjs";
import { Action } from "@ngrx/store";
import { flatMap, map } from "rxjs/operators";
import { Event } from "./event";

export function onEvent<VerbType extends string>(
  expectedEvent: VerbType
): OperatorFunction<Action, Event<VerbType>> {
  return flatMap((action: Action) =>
    (action as Event<VerbType>).verb === expectedEvent
      ? of(action as Event<VerbType>)
      : EMPTY
  );
}
