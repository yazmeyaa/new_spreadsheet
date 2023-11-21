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
}

export class Cell {
  value: string | null;
  styles: CellStyle | null;
  reference: CellReference;

  constructor(props: CellConstructorProps) {
    this.value = props.value;
    this.styles = props.styles;
    this.reference = props.reference;
  }

  static checkIsReference(obj: object): boolean {
    if ("col" in obj && "row" in obj && "sheetName" in obj) return true;
    else return false;
  }
}
