import { Spreadsheet } from "..";
import { CellChangeEvent } from "./cell_change";
import { TableResizeEvent } from "./table_resize";

export abstract class Event {
  public abstract name: string;
  public spreadsheet: Spreadsheet;
  private _preventedDefault = false;
  public get preventedDefault() {
    return this._preventedDefault;
  }

  constructor(spreadsheet: Spreadsheet) {
    this.spreadsheet = spreadsheet;
  }

  public preventDefault() {
    this._preventedDefault = true;
  }
}

type EventTypeMap = {
  cell_change: CellChangeEvent;
  table_resize: TableResizeEvent;
};
type EventName = keyof EventTypeMap;
type EventValue = EventTypeMap[EventName];
type EventFromName<T extends EventName> = EventTypeMap[T];

export type EventListener<E extends Event> = (event: E) => Event;
export type StaticKeys = "cell_change";
export type EventListenersArray<E extends Event> = Array<EventListener<E>>;
export type Listeners<E extends Event = Event> = {
  [key in EventName]: EventListener<EventValue>[];
} & {
  [key: string]: EventListenersArray<E>;
};

export class EventManager {
  //? private root: Spreadsheet;
  private listeners: Listeners = {
    cell_change: [],
    table_resize: [],
  };

  //? constructor(root: Spreadsheet) {
  //?   this.root = root;
  //? }

  public dispatch<T extends EventName>(eventName: T,event: EventFromName<T>): void;
  public dispatch<T extends Exclude<string, EventName>,E extends Event = Event>(eventName: T, event: E): void;
  public dispatch(eventName: EventName | string, event: Event): void {
    const listeners = this.listeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(event as Event);
      });
    }
  }
  public addEventListener<T extends EventName>(eventName: T,event: (event: EventFromName<T>) => void): void;
  public addEventListener<T extends Exclude<string, EventName>,E extends Event = Event>(eventName: T, event: (event: E) => void): void;
  public addEventListener(key: string | EventName,callback: (event: Event) => any) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(callback);
  }
}
