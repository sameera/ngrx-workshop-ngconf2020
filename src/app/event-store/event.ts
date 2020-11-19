import { Action } from "@ngrx/store";

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
