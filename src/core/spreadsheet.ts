import { Table } from "../components/table/table";
import { Toolbar } from "../components/toolbar";
import { getToolbarGroup } from "../components/toolbar_ui/groups";
import { CellConstructorProps, CellReference } from "./cell";
import { CSS_PREFIX } from "../main";
import { Cell } from "./cell";
import { SheetList } from "./sheet/sheet";
import {
  getCellAddress,
  getCellReference,
  removeSheetNameFromAddress,
} from "../helpers";
import { EventManager } from "./events";
import { CellChangeEvent, CellChangeEventConstructorProps } from "./events/cell_change";

export class Spreadsheet {
  public element: HTMLElement;
  public sheets: SheetList = new SheetList();
  public readonly components = {
    toolbar: new Toolbar(this),
    table: new Table(this),
  } as const;
  public readonly events = new EventManager();

  constructor() {
    this.element = this.buildTable();
  }

  private buildTable(): HTMLElement {
    const spreadsheetContainer = document.createElement("div");
    spreadsheetContainer.classList.add(`${CSS_PREFIX}spreadsheet`);

    const stylesGroup = getToolbarGroup("styles", this);

    this.components.toolbar.groups.addGroup(stylesGroup);
    this.components.toolbar.build();

    this.components.toolbar.mountElement(spreadsheetContainer);
    this.components.table.mountElement(spreadsheetContainer);

    return spreadsheetContainer;
  }

  private getCellByReference(reference: CellReference): Cell | null {
    const sheet = this.sheets.getSheet(reference.sheetName);
    if (!sheet)
      throw new Error("Sheet id does not exist: " + reference.sheetName);
    const address = getCellAddress(reference);
    if (!address)
      throw new Error(
        "Cannot get cell by reference: " + JSON.stringify(reference)
      );
    const cell = this.getCellByAddress(address);
    return cell;
  }

  private getCellByAddress(address: string): Cell | null {
    const reference = getCellReference(address);

    if (!reference)
      throw new Error("Cannot get reference by address: " + address);
    let sheet = this.sheets.getSheet(reference.sheetName);
    if (!sheet) {
      throw new Error("Cannot find sheet with name " + reference.sheetName);
    }


    const value = sheet.getCell(address) ?? null;
    const styles = sheet.styles.getStyles(address) ?? null;

    const cellProps: CellConstructorProps = { value, styles, reference };
    return new Cell(cellProps);
  }

  public getCell(reference: CellReference): Cell;
  public getCell(address: string): Cell;
  public getCell(
    referenceOrAddress: CellReference | string
  ): Cell | null | never {
    let isReference: boolean = false;
    if (typeof referenceOrAddress === "object") {
      isReference = Cell.checkIsReference(referenceOrAddress);
    }
    const reference = isReference
      ? (referenceOrAddress as CellReference)
      : null;

    if (reference) {
      return this.getCellByReference(reference);
    } else if (typeof referenceOrAddress === "string") {
      return this.getCellByAddress(referenceOrAddress);
    } else return null;
  }

  public setCellValue(address: string, value: string, dispatch: boolean = true): string | null {
    const cellReference = getCellReference(address);
    if(!cellReference) {
      return null;
    }

    const sheet = this.sheets.getSheet(cellReference.sheetName);
    if(!sheet) return null;

    const addressWithoutSheetname = removeSheetNameFromAddress(address);
    sheet.data.setValue(addressWithoutSheetname, value);

    if(dispatch) {
      const eventProperties: CellChangeEventConstructorProps = {
        address,
        newValue: value
      }
      const event = new CellChangeEvent(this, eventProperties);
      this.events.dispatch('cell_change', event);
    }
    
    return value;
  }

  public destroy(): void {
    this.element.parentElement?.removeChild(this.element);
  }

  public mount(target: HTMLElement): HTMLElement {
    console.log(target);
    target.appendChild(this.element);
    return this.element;
  }
}
