import { CSS_PREFIX } from "../../main";
// import { Table } from "./table";

export class ScrollerComponent {
  public element: HTMLElement;
  // private table: Table;
  public width: number = 0;
  public height: number = 0;

  constructor(/*table: Table*/) {
    // this.table = table;
    this.element = this.createElement();
  }

  createElement(): HTMLElement {
    const scrollerElement = document.createElement("div");
    scrollerElement.classList.add(`${CSS_PREFIX}spreadsheet_scroller`);
    return scrollerElement;
  }
}
