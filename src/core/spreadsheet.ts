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
import {
  CellChangeEvent,
  CellChangeEventConstructorProps,
} from "./events/cell_change";
import { CellStyleConstructorProps } from "./sheet/styles";
import {
  CellStyleChangeEvent,
  CellStyleChangeEventConstructorProps,
} from "./events/style_change";
import { TableResizeEvent } from "./events/table_resize";

export class Spreadsheet {
  public element: HTMLElement;
  public readonly components = {
    toolbar: new Toolbar(this),
    table: new Table(this),
  } as const;
  public readonly events = new EventManager();
  public sheets: SheetList = new SheetList(this);
  private resizeObserver: ResizeObserver;

  constructor() {
    this.element = this.buildTable();
    this.normalizeTableSizes();
    this.setup();
    this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
    this.resizeObserver.observe(this.element);
  }

  private normalizeTableSizes(): void {
    this.components.table.normalizeTableSizes();
  }

  private setup(): void {
    this.setupListeners();
    window.requestAnimationFrame(
      this.components.table.normalizeTableSizes.bind(this.components.table)
    );
  }

  private handleResize(): void {
    const event = new TableResizeEvent(this);
    this.events.dispatch("table_resize", event);
  }

  private setupListeners(): void {
    this.events.addEventListener("active_sheet_change", () => {
      const sheet = this.sheets.activeSheet;
      if (!sheet) return;
      this.components.table.setScrollerSizeToSheetSizes(sheet, {
        columnsToRender: 100,
        rowsToRender: 100,
      });
    });

    this.events.addEventListener("table_resize", () => {
      this.normalizeTableSizes();
      this.components.table.drawGrid({columns: 40, rows: 40});
    });
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
    const sheet = this.sheets.getSheet(reference.sheetName);
    if (!sheet) {
      throw new Error("Cannot find sheet with name " + reference.sheetName);
    }

    const value = sheet.getCell(address) ?? null;
    const styles = sheet.styles.getStyles(address) ?? null;
    const width = sheet.properties.getColumn(reference.row).width
    const height = sheet.properties.getRow(reference.col).height;

    const cellProps: CellConstructorProps = { value, styles, reference, width, height };
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

  public setCellValue(
    address: string,
    value: string,
    dispatch: boolean = true
  ): string | null {
    const cellReference = getCellReference(address);
    if (!cellReference) {
      console.error("Wrong address format: " + address);
      return null;
    }

    const sheet = this.sheets.getSheet(cellReference.sheetName);
    if (!sheet) {
      console.error(
        "Cannot get sheet with name or id: " + cellReference.sheetName
      );
      return null;
    }

    const addressWithoutSheetname = removeSheetNameFromAddress(address);
    sheet.data.setValue(addressWithoutSheetname, value);

    if (dispatch) {
      const eventProperties: CellChangeEventConstructorProps = {
        address,
        newValue: value,
      };
      const event = new CellChangeEvent(this, eventProperties);
      this.events.dispatch("table_resize", event);
    }

    return value;
  }

  public setCellStyles(
    address: string,
    styles: CellStyleConstructorProps,
    dispatch: boolean = true
  ): void {
    const cellReference = getCellReference(address);
    if (!cellReference) {
      console.error("Wrong address format: " + address);
      return;
    }

    const sheet = this.sheets.getSheet(cellReference.sheetName);
    if (!sheet) {
      console.error(
        "Cannot get sheet with name or id: " + cellReference.sheetName
      );
      return;
    }
    const addressWithoutSheetname = removeSheetNameFromAddress(address);
    sheet.styles.setStyles(addressWithoutSheetname, styles);
    const newStyles = sheet.styles.getStyles(addressWithoutSheetname);

    if (dispatch) {
      const eventProps: CellStyleChangeEventConstructorProps = {
        address,
        styles: newStyles,
      };
      const event = new CellStyleChangeEvent(this, eventProps);
      this.events.dispatch("cell_styles_change", event);
    }
  }

  public destroy(): void {
    this.element.parentElement?.removeChild(this.element);
  }

  public mount(target: HTMLElement): HTMLElement {
    target.appendChild(this.element);
    return this.element;
  }
}
