import {
  EventLog,
  HandlerTypes_contractRegisterArgs,
  HandlerTypes_loaderArgs,
  HandlerTypes_handlerArgs,
} from "../../generated/src/Types.gen";

export type Event<Params extends object = {}> = EventLog<Params>;

export type Loader<eventArgs> = HandlerTypes_loaderArgs<eventArgs>;
export type Handler<eventArgs, loaderReturn> = HandlerTypes_handlerArgs<
  eventArgs,
  loaderReturn
>;
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
