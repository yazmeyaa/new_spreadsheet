import { Table } from "../components/table/table";
import { CellReference } from "./cell";

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
    console.log(cell, this.ctx, this.canvas)
  }


}
