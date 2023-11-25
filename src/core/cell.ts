import { CellStyle } from "./sheet/styles";

export type CellReference = {
  col: number;
  row: number;
  sheetName: string;
};

export interface CellConstructorProps {
  value: string | null;
  styles: CellStyle | null;
  reference: CellReference;
  width: number
  height: number
}

export class Cell {
  value: string | null;
  styles: CellStyle | null;
  reference: CellReference;
  width: number
  height: number

  constructor(props: CellConstructorProps) {
    this.value = props.value;
    this.styles = props.styles;
    this.reference = props.reference;
    this.height = props.height
    this.width = props.width
  }

  static checkIsReference(obj: object): boolean {
    if ("col" in obj && "row" in obj && "sheetName" in obj) return true;
    else return false;
  }
}
