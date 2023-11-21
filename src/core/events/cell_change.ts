import { Event } from ".";
import { Spreadsheet } from "..";

export interface CellChangeEventConstructorProps {
    address: string,
    newValue: string
}

export class CellChangeEvent extends Event {
    public readonly name = "cell_change" as const;
    public readonly address: string;
    public readonly newValue: string;
    constructor(spreadsheet: Spreadsheet, props: CellChangeEventConstructorProps) {
      super(spreadsheet);
      this.address = props.address;
      this.newValue = props.newValue;
    }
  }