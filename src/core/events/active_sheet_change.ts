import { Event } from ".";
import { Sheet, Spreadsheet } from "..";

export class ActiveSheetChangeEvent extends Event {
  public readonly name = "active_sheet_change";
  public sheet: Sheet;
  constructor(spreadsheet: Spreadsheet, sheet: Sheet) {
    super(spreadsheet);
    this.sheet = sheet;
  }
}
