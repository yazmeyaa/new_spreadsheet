import { CSS_PREFIX } from "../../main";
import { Table } from "./table";

export class CanvasComponent {
  private table: Table;
  public element: HTMLCanvasElement;
  constructor(table: Table) {
    this.table = table;
    this.element = this.createElement();
  }

  public createElement(): HTMLCanvasElement {
    const canvasElement = document.createElement("canvas");
    canvasElement.classList.add(`${CSS_PREFIX}spreadsheet_canvas`);

    return canvasElement;
  }

  public setCanvasSizes(sizes: { width: number; height: number }): void {
    this.element.style.height = `${sizes.height}px`;
    this.element.style.width = `${sizes.width}px`;
    this.element.width = sizes.width;
    this.element.height = sizes.height;
    console.log(123)
  }
}
