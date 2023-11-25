import { Sheet } from ".";
import { Table } from "../components/table/table";
import { CellReference } from "./cell";
import { CellStyle } from "./sheet/styles";

// interface ViewportBox {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// interface Cell {
//   row: number;
//   col: number;
// }

// interface ViewportRowsAndColumns {
//   start: Cell;
//   end: Cell;
// }

// interface ViewportProperties {
//   box: ViewportBox;
//   cells: ViewportRowsAndColumns
// }

// interface Scroll {
//   left: number;
//   top: number;
// }

export class TableRenderer {
  private tableComponent: Table;
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(tableComponent: Table, ctx: CanvasRenderingContext2D) {
    this.tableComponent = tableComponent;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
  }

  public renderCell(reference: CellReference): void {
    const cell = this.tableComponent.root.getCell(reference);
    const {x, y} = this.getCellCoords(reference);
    if(!cell.styles) cell.styles = new CellStyle();

    this.ctx.fillStyle = cell.styles.backgroundColor;
    this.ctx.fillRect(x, y, cell.width, cell.height);
    this.ctx.strokeStyle = cell.styles.borderColor;
    this.ctx.strokeRect(x, y, cell.width, cell.height);
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  public drawGrid(dimensions: {rows: number, columns: number}): void {
    const sheet = this.tableComponent.root.sheets.activeSheet;
    if(!sheet) return;
    this.clearCanvas();
    
    for(let row = 0; row < dimensions.rows; row++) {
      for(let col = 0; col < dimensions.columns; col++) {
        const reference: CellReference = {col, row, sheetName: sheet.name};
        this.renderCell(reference);
      }
    }
  }

  private getCellY(cell: CellReference, sheet: Sheet): number {
    const row = cell.row;
    const modifiedRowsBefore = sheet.properties
    .getAllRowsKeys()
    .filter((item) => item < row);
    const modifiedRows = modifiedRowsBefore.map(item => sheet.properties.getRow(item));
    const modifiedWidth = modifiedRows.reduce(
      (sum, row) => (sum += row.height),
      0
    );
    const defaultRowsHeight =
      (row - modifiedRows.length) * sheet.properties.DEFAULT_ROW_SIZE;

    return modifiedWidth + defaultRowsHeight;
  }

  private getCellX(cell: CellReference, sheet: Sheet): number {
    const col = cell.col;
    const modifiedColumnsBefore = sheet.properties
      .getAllColumnsKeys()
      .filter((item) => item < col);
    const modifiedColumns = modifiedColumnsBefore.map((item) =>
      sheet.properties.getColumn(item)
    );
    const modifiedWidth = modifiedColumns.reduce(
      (sum, col) => (sum += col.width),
      0
    );

    const defaultCellsWidth =
      (col - modifiedColumns.length) * sheet.properties.DEFAULT_COLUMN_SIZE;

    return defaultCellsWidth + modifiedWidth;
  }

  public getCellCoords(cell: CellReference): { x: number; y: number } {
    const sheet = this.tableComponent.root.sheets.getSheet(cell.sheetName);
    if (!sheet)
      throw new Error(
        "Cannot get cell with reference: " + JSON.stringify(cell)
      );
      const x = this.getCellX(cell, sheet);
      const y = this.getCellY(cell, sheet);

    return { x, y };
  }
}
