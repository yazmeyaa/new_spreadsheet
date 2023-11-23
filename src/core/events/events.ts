import { Spreadsheet } from "..";
import { ActiveSheetChangeEvent } from "./active_sheet_change";
import { CellChangeEvent } from "./cell_change";
import { CellStyleChangeEvent } from "./style_change";
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
  cell_styles_change: CellStyleChangeEvent;
  table_resize: TableResizeEvent;
  active_sheet_change: ActiveSheetChangeEvent;
};
type EventName = keyof EventTypeMap;
type EventValue = EventTypeMap[EventName];
type EventFromName<T extends EventName> = EventTypeMap[T];

export type EventListener<E extends Event> = (event: E) => void;
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
    cell_styles_change: [],
    active_sheet_change: [],
  };

  //? constructor(root: Spreadsheet) {
  //?   this.root = root;
  //? }

  public dispatch<T extends EventName>(
    eventName: T,
    event: EventFromName<T>
  ): void;
  public dispatch<
    T extends Exclude<string, EventName>,
    E extends Event = Event
  >(eventName: T, event: E): void;
  public dispatch(eventName: EventName | string, event: Event): void {
    const listeners = this.listeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(event as Event);
      });
    }
  }
  public addEventListener<T extends EventName>(
    eventName: T,
    event: (event: EventFromName<T>) => void
  ): void;
  public addEventListener<
    T extends Exclude<string, EventName>,
    E extends Event = Event
  >(eventName: T, event: (event: E) => void): void;
  public addEventListener(
    key: string | EventName,
    callback: (event: Event) => void
  ) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(callback);
  }
}
