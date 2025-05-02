import type {
  EventLog,
  HandlerTypes_contractRegisterArgs,
  HandlerTypes_handlerArgs,
  HandlerTypes_loaderArgs,
} from "../../generated/src/Types.gen";

export type Event<Params extends object = Record<string, unknown>> = EventLog<Params>;

export type Loader<eventArgs> = HandlerTypes_loaderArgs<eventArgs>;
export type Handler<eventArgs, loaderReturn> = HandlerTypes_handlerArgs<eventArgs, loaderReturn>;
export type Register<eventArgs> = HandlerTypes_contractRegisterArgs<eventArgs>;

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };
export type Address = string;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};
