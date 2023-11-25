import { Component, Sheet, Spreadsheet } from "../../core";
import { CellReference } from "../../core/cell";
import { TableRenderer } from "../../core/table_renderer";
import { CSS_PREFIX } from "../../main";
import { CanvasComponent } from "./canvas";
import { ScrollerComponent } from "./scroller";
import { TableProperties } from "./table_properties";

export class Table extends Component {
  public element: HTMLElement;
  public root: Spreadsheet;
  private scrollerComponent: ScrollerComponent;
  private canvasComponent: CanvasComponent;
  private renderer: TableRenderer;
  private properties: TableProperties;

  constructor(root: Spreadsheet) {
    super();
    this.root = root;
    this.scrollerComponent = new ScrollerComponent();
    this.canvasComponent = new CanvasComponent(this);
    const tableElement = this.createElement();
    this.element = tableElement;
    const ctx = this.canvasComponent.element.getContext("2d");
    if (!ctx) throw new Error("Cannot get canvas rendering context!");
    this.renderer = new TableRenderer(this, ctx);
    this.properties = new TableProperties(this);
  }

  public normalizeTableSizes(): void {
    const rootBox = this.root.element.getBoundingClientRect();
    const borderSize = 2;
    const width = rootBox.width - borderSize * 2;
    const height =
      rootBox.height -
      this.root.components.toolbar.element.getBoundingClientRect().height -
      borderSize * 2;
    const sizes = { width, height };
    this.scrollerComponent.setElementSizes(sizes);
    this.canvasComponent.setCanvasSizes(sizes)
  }

  public getCellCoords(cell: CellReference): { x: number; y: number } {
    return this.renderer.getCellCoords(cell);
  }

  public renderCell(reference: CellReference): void {
    this.renderer.renderCell(reference);
  }

  public drawGrid(dimensions: {rows: number, columns: number}): void {
    this.renderer.drawGrid(dimensions);
  }

  public setScrollerSizeToSheetSizes(
    sheet: Sheet,
    params: GetSheetSizesParams
  ) {
    const sizes = getSheetSizes(sheet, params);
    this.setScrollerSizes(sizes);
  }

  public setScrollerSizes(sizes: { width: number; height: number }): void {
    this.scrollerComponent.setScrollerSizes(sizes);
  }

  private createElement(): HTMLElement {
    const scrollerElement = this.scrollerComponent.element;
    const tableElement = document.createElement("div");
    tableElement.classList.add(`${CSS_PREFIX}spreadsheet_table`);

    const canvasElement = this.canvasComponent.element;
    tableElement.appendChild(canvasElement);
    tableElement.appendChild(scrollerElement);
    return tableElement;
  }

  public destroyElement(): HTMLElement {
    throw new Error("Method not implemented.");
  }
}

interface GetSheetSizesParams {
  rowsToRender: number;
  columnsToRender: number;
}

function getSheetSizes(
  sheet: Sheet,
  params: GetSheetSizesParams
): { height: number; width: number } {
  const { columnsToRender, rowsToRender } = params;
  const modifiedRowsKeys = sheet.properties
    .getAllRowsKeys()
    .filter((item) => item <= rowsToRender);

  const modifiedRows = modifiedRowsKeys.map((item) =>
    sheet.properties.getRow(item)
  );
  const modifiedRowsHeight = modifiedRows.reduce((acc, row) => {
    return (acc += row.height);
  }, 0);

  const height =
    rowsToRender * sheet.properties.DEFAULT_ROW_SIZE -
    modifiedRowsKeys.length * sheet.properties.DEFAULT_ROW_SIZE +
    modifiedRowsHeight;

  const modifiedColumnsKeys = sheet.properties
    .getAllColumnsKeys()
    .filter((item) => item <= columnsToRender);
  const modifiedColumns = modifiedColumnsKeys.map((item) =>
    sheet.properties.getColumn(item)
  );
  const modifiedColumnsWidth = modifiedColumns.reduce(
    (acc, row) => (acc += row.width),
    0
  );

  const width =
    columnsToRender * sheet.properties.DEFAULT_COLUMN_SIZE -
    modifiedColumnsKeys.length * sheet.properties.DEFAULT_COLUMN_SIZE +
    modifiedColumnsWidth;

  return {
    height,
    width,
  };
}
