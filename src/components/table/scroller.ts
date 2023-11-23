import { CSS_PREFIX } from "../../main";

export interface ScrollerComponentElements {
  scrollerContainer: HTMLElement;
  scrollerElement: HTMLElement;
  widthElement: HTMLElement;
  heightElement: HTMLElement;
}

export class ScrollerComponent {
  public element: HTMLElement;
  private widthElement: HTMLElement;
  private heightElement: HTMLElement;


  constructor() {
    const { scrollerContainer, heightElement, widthElement } = this.createElement();

    this.element = scrollerContainer;
    this.widthElement = widthElement;
    this.heightElement = heightElement;
  }

  public createElement(): ScrollerComponentElements {
    const scrollerContainer = document.createElement("div");
    scrollerContainer.classList.add(`${CSS_PREFIX}spreadsheet_scroller`);
    const scrollerElement = document.createElement("div");

    const widthElement = document.createElement("div");
    const heightElement = document.createElement("div");
    widthElement.style.cssText = "pointer-events: none; height: 0px;";
    heightElement.style.cssText = "pointer-events: none; width: 0px;";

    const widthAndHeightContainer = document.createElement('div');

    widthAndHeightContainer.appendChild(widthElement);
    widthAndHeightContainer.appendChild(heightElement);

    scrollerElement.appendChild(widthAndHeightContainer);

    scrollerElement.style.display = "flex";
    scrollerContainer.appendChild(scrollerElement);
    return { scrollerContainer, scrollerElement, widthElement, heightElement };
  }

  public setElementSizes(sizes: { width: number; height: number }): void {
    this.element.style.height = `${sizes.height}px`;
    this.element.style.width = `${sizes.width}px`;
  }

  public setScrollerSizes(sizes: { width: number; height: number }): void {
    this.heightElement.style.height = `${sizes.height}px`;
    this.widthElement.style.width = `${sizes.width}px`;
  }
}
