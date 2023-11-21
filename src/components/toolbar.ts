import { Spreadsheet } from "../core";
import { Component } from "../core";
import { getRandomId } from "../helpers";
import { CSS_PREFIX } from "../main";

export class Toolbar extends Component {
  public element: HTMLElement;
  public root: Spreadsheet;
  public readonly groups = new GroupList(this);

  constructor(root: Spreadsheet) {
    super();
    this.root = root;
    this.element = this.createElement();
  }

  private createElement(): HTMLElement {
    const container = document.createElement("div");
    container.classList.add(`${CSS_PREFIX}spreadsheet_toolbar`);
    const groups = this.groups.createElement();
    container.appendChild(groups);

    return container;
  }

  public build() {
    this.destroyElement();
    this.element = this.createElement();
  }

  public destroyElement(): void {
    this.element.parentElement?.removeChild(this.element);
  }
}

export class GroupList {
  toolbar: Toolbar;
  private _groups: Map<string, ToolbarGroup> = new Map();
  public get groups(): Map<string, ToolbarGroup> {
    return this._groups;
  }

  constructor(toolbar: Toolbar) {
    this.toolbar = toolbar;
  }

  public createGroup(
    props: Omit<ToolbarGroupConstructorProps, "root">
  ): ToolbarGroup {
    const joinProps = {} as ToolbarGroupConstructorProps;
    Object.assign(joinProps, props, { root: this.toolbar.root });

    const group = new ToolbarGroup(joinProps);
    return group;
  }

  public addGroup(group: ToolbarGroup): void | never {
    if (this._groups.get(group.id))
      throw new Error(`Group with this id: ${group.id} is already exist`);
    this._groups.set(group.id, group);
  }

  public createElement(): HTMLElement {
    const groups = document.createElement("div");
    const groupList = this._groups.values();


    for (const group of groupList) {
      groups.appendChild(group.createElement());
    }

    return groups;
  }
}

export interface ToolbarGroupConstructorProps {
  root: Spreadsheet;
  name: string;
}

export class ToolbarGroup {
  public readonly id: string;
  public readonly name: string;
  public buttons: Array<HTMLButtonElement> = [];
  private root: Spreadsheet;

  constructor(props: ToolbarGroupConstructorProps) {
    this.root = props.root;
    this.id = getRandomId();
    this.name = props.name;
  }

  public addButton(
    text: string,
    onClickCallback: (event: MouseEvent, root: Spreadsheet) => void
  ) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", (event) =>
      onClickCallback(event, this.root)
    );

    this.buttons.push(button);
  }

  public createElement(): HTMLElement {
    const buttons = document.createElement("div");

    for (const button of this.buttons) {
      buttons.appendChild(button);
    }

    return buttons;
  }
}
