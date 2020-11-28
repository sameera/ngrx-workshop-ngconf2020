import { Action } from "@ngrx/store";

export interface Event extends Action {
  readonly verb: string;
  readonly source: string;
  [other: string]: any;
}
