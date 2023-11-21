import { Spreadsheet } from "..";

export abstract class Component {
    public abstract element: HTMLElement;
    public abstract root: Spreadsheet;

    public mountElement(target: HTMLElement): void {
        target.appendChild(this.element);
    };
    public abstract destroyElement(): void;
}