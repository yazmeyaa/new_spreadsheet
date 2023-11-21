import { Component, Spreadsheet } from "../../core";
// import { TableRenderer } from "../../core/table_renderer";
import { CSS_PREFIX } from "../../main";
import { CanvasComponent } from "./canvas";
import { ScrollerComponent } from "./scroller";

export class Table extends Component {
  public element: HTMLElement;
  public root: Spreadsheet;
  private scrollerComponent: ScrollerComponent;
  private canvasComponent: CanvasComponent;
  // private renderer: TableRenderer;

  constructor(root: Spreadsheet) {
    super();
    this.root = root;
    this.scrollerComponent = new ScrollerComponent();
    this.canvasComponent = new CanvasComponent();
    const tableElement = this.createElement();
    this.element = tableElement;
    const ctx = this.canvasComponent.element.getContext("2d");
    if (!ctx) throw new Error("Cannot get canvas rendering context!");
    // this.renderer = new TableRenderer(this, ctx);
  }

  private createElement(): HTMLElement {
    const scrollerElement = this.scrollerComponent.element;
    const tableElement = document.createElement("div");
    tableElement.classList.add(`${CSS_PREFIX}spreadsheet_table`);

    const canvasElement = this.canvasComponent.element;
    tableElement.appendChild(scrollerElement);
    tableElement.appendChild(canvasElement);
    return tableElement;
  }

  public destroyElement(): HTMLElement {
    throw new Error("Method not implemented.");
  }
}
