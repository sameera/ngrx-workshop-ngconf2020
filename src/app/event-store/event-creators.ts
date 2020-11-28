import { Event } from "./event";

export function args<T>() {
    return ("args" as any) as T;
}

export type EventCreatorParamless = () => Event;
export type EventCreator<ArgsType> = (args: ArgsType) => Event & ArgsType;

export interface VerbedEvent {
    verb: string;
}

export type EventAssemblerParamless = (source: string) => Event;
export type EventAssembler<ArgsType> = (source: string, args: ArgsType) => Event & ArgsType;

export function toEvent(source: string, verb: string): Event {
    return {
        verb,
        source,
        type: `[${source}] ${verb}`,
    };
}

export function createEvent(source: string, verb: string): EventCreatorParamless;
export function createEvent<ArgsType>(source: string, verb: string, config: ArgsType): EventCreator<ArgsType>;
export function createEvent<ArgsType>(
    source: string,
    verb: string,
    config?: ArgsType
): EventCreatorParamless | EventCreator<ArgsType> {
    if (!config) {
        const creator: EventCreatorParamless = () => toEvent(source, verb);
        ((creator as any) as VerbedEvent).verb = verb;
        return creator;
    } else {
        const creator = (params: ArgsType) => ({
            ...params,
            verb,
            source,
            type: `[${source}] ${verb}`,
        });
        ((creator as any) as VerbedEvent).verb = verb;
        return creator;
    }
}

export function prepareEvent(verb: string): EventAssemblerParamless;
export function prepareEvent<ArgsType>(verb: string, config: ArgsType): EventAssembler<ArgsType>;
export function prepareEvent<ArgsType>(
    verb: string,
    config?: ArgsType
): EventAssemblerParamless | EventAssembler<ArgsType> {
    if (!config) {
        const assembler = (source: string) => toEvent(source, verb);
        ((assembler as any) as VerbedEvent).verb = verb;
        return assembler;
    } else {
        const assembler = (source: string, prop: ArgsType) => ({
            ...prop,
            verb,
            source,
            type: `[${source}] ${verb}`,
        });
        ((assembler as any) as VerbedEvent).verb = verb;
        return assembler;
    }
}
