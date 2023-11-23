import { Table } from "../components/table/table";
import { CellReference } from "./cell";

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
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, 20, 20);
    console.log(cell, this.ctx, this.canvas)
  }


}
