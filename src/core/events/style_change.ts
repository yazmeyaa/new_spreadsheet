import { Event } from ".";
import { Spreadsheet } from "..";
import { CellStyle } from "../sheet/styles";

export interface CellStyleChangeEventConstructorProps {
    address: string;
    styles: CellStyle | null;
}

export class CellStyleChangeEvent extends Event {
    public name = 'styles_change';
    public address: string;
    public styles: CellStyle | null;
    constructor(spreadsheet: Spreadsheet, props: CellStyleChangeEventConstructorProps) {
        super(spreadsheet);
        this.address = props.address;
        this.styles = props.styles;
    }
}