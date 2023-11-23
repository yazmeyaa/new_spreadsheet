import { Spreadsheet } from "..";
import {
  getCellAddress,
  getRandomId,
  removeSheetNameFromAddress,
} from "../../helpers";
import { CellReference } from "../cell";
import { ActiveSheetChangeEvent } from "../events/active_sheet_change";
import { SheetData, SheetDataType } from "./data";
import { SheetProperties } from "./properties";
import { SheetStyles } from "./styles";

export interface SheetConstructorProps {
  initialData?: SheetDataType;
  name?: string;
}

export class Sheet {
  public readonly id: string;
  private _data: SheetData;
  public get data(): SheetData {
    return this._data;
  }
  public static SHEETS_COUNT: number = 0;
  private _name: string;
  public get name(): string {
    return this._name;
  }
  public readonly properties = new SheetProperties();

  public readonly styles: SheetStyles = new SheetStyles();

  constructor(props?: SheetConstructorProps) {
    this.id = getRandomId();

    const defaultProps = this.createInitialProps();
    if (!props) {
      this._data = new SheetData(defaultProps);
      this._name = defaultProps.name;
    } else {
      this._data = new SheetData(props);
      this._name = props.name ?? defaultProps.name;
    }

    Sheet.SHEETS_COUNT += 1;
  }

  setCellValue(address: string, value: string): string | null {
    this.data.setValue(address, value);
    return this.data.getValue(address)
  }

  private getCellByAddress(address: string): string | null {
    const value = this.data.getValue(address);
    if (!value) return null;
    return value;
  }

  private getCellByReference(reference: CellReference): string | null {
    const address = getCellAddress(reference);
    return this.getCellByAddress(address);
  }

  public getCell(address: string): string | null;
  public getCell(cellReference: CellReference): string | null;
  public getCell(input: CellReference | string): string | null {
    if (typeof input === "string") {
      const addressWithoutSheetname = removeSheetNameFromAddress(input);

      return this.getCellByAddress(addressWithoutSheetname);
    } else if (typeof input === "object") return this.getCellByReference(input);
    else return null;
  }

  private createInitialProps(): Required<SheetConstructorProps> {
    const initialProps: Required<SheetConstructorProps> = {
      initialData: new Map(),
      name: `Sheet ${Sheet.SHEETS_COUNT + 1}`,
    };

    return initialProps;
  }
}

export class SheetList {
  private sheets: Map<string, Sheet> = new Map();
  private _activeSheet: Sheet | null = null;
  private spreadsheet: Spreadsheet;

  constructor(spreadsheet: Spreadsheet) {
    this.spreadsheet = spreadsheet;
  }

  public get activeSheet(): Sheet | null {
    return this._activeSheet;
  }

  /**
   * Create sheet and add it to list of sheets
   * @param props Sheet constructor properties
   * @returns Sheet
   */
  public createNewSheet(
    props?: SheetConstructorProps,
    makeActive: boolean = true
  ): Sheet {
    const sheet = new Sheet(props);
    this.sheets.set(sheet.id, sheet);

    if (makeActive) this.setActiveSheet(sheet);
    return sheet;
  }

  private checkSheetName(sheet: Sheet): boolean {
    const name = sheet.name;

    const sheets = Array.from(this.sheets.values());
    let isNameExist: boolean = false;
    for (const sheet of sheets) {
      if (sheet.name !== name) continue;

      isNameExist = true;
      break;
    }
    return isNameExist;
  }

  public addSheet(sheet: Sheet, makeActive: boolean = true): Sheet | never {
    const isNameExist = this.checkSheetName(sheet);
    if (this.sheets.get(sheet.id) || isNameExist)
      throw new Error("Sheet with same ID is already exist!");
    this.sheets.set(sheet.id, sheet);
    if (makeActive) this.setActiveSheet(sheet);
    return sheet;
  }

  public getSheet(idOrName: string): Sheet | null {
    let sheet: Sheet | null | undefined = this.sheets.get(idOrName);
    if (!sheet) {
      sheet = this.findSheetByName(idOrName);
      if (!sheet) return null;
    }
    return sheet;
  }

  public findSheetByName(name: string): Sheet | null {
    const sheets = Array.from(this.sheets.values());
    let sheet: Sheet | null = null;

    for (const singleSheet of sheets) {
      if (singleSheet.name !== name) continue;
      sheet = singleSheet;
      break;
    }

    return sheet;
  }

  private dispatchChangeActiveSheet(sheet: Sheet): void {
    const event = new ActiveSheetChangeEvent(this.spreadsheet, sheet);
    this.spreadsheet.events.dispatch('active_sheet_change', event);
  }

  public setActiveSheet(sheet: Sheet): Sheet;
  public setActiveSheet(id: string): Sheet | null;
  public setActiveSheet(sheetOrId: string | Sheet): Sheet | null {
    if (sheetOrId instanceof Sheet) {
      this._activeSheet = sheetOrId;
      this.dispatchChangeActiveSheet(this._activeSheet);
      return sheetOrId;
    } else {
      const sheet = this.sheets.get(sheetOrId);
      if (!sheet) return null;
      this._activeSheet = sheet;
      this.dispatchChangeActiveSheet(sheet);
      return sheet;
    }
  }
}
