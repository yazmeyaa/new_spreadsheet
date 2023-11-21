import { Event } from ".";
import { Spreadsheet } from "..";

export class TableResizeEvent extends Event {
  public readonly name = "table_resize" as const;
  constructor(spreadsheet: Spreadsheet) {
    super(spreadsheet);
  }
}
