const defaultRowProps: Required<RowConstructorProps> = {
  height: 14,
} as const;

const defaultColumnProps: Required<ColumnsConstructorProps> = {
  width: 14,
} as const;

export interface ColumnsConstructorProps {
  width?: number;
}

export class Column {
  private _width: number = defaultColumnProps.width;
  public get width(): number {
    return this._width;
  }

  constructor(props?: ColumnsConstructorProps) {
    if (props) {
      if (props.width) this._width = props.width;
    }
  }

  public setProperties(props?: ColumnsConstructorProps): void {
    if (props) Object.assign(this, props);
  }
}

export interface RowConstructorProps {
  height?: number;
}

export class Row {
  private _height: number = defaultRowProps.height;
  public get height(): number {
    return this._height;
  }

  constructor(props?: RowConstructorProps) {
    if (props) {
      if (props.height) this._height = props.height;
    }
  }

  public setProperties(props?: RowConstructorProps): void {
    if (props) Object.assign(this, props);
  }
}

export class SheetProperties {
  private columns: Map<number, Column> = new Map();
  private rows: Map<number, Row> = new Map();

  public getRow(rowIdx: number): Row {
    const row = this.rows.get(rowIdx);
    if (!row) return new Row();
    else return row;
  }

  public getColumn(colUdx: number): Column {
    const column = this.columns.get(colUdx);
    if (!column) return new Column();
    else return column;
  }

  setRow(rowIdx: number, props?: RowConstructorProps): Row {
    if (this.rows.has(rowIdx) === false) {
      const row = new Row(props);
      this.rows.set(rowIdx, row);
      return row;
    } else {
      const row = this.rows.get(rowIdx)!;
      row.setProperties(props);
      return row;
    }
  }

  setColumn(colIdx: number, props?: ColumnsConstructorProps): Column {
    if (this.rows.has(colIdx) === false) {
      const column = new Column(props);
      this.columns.set(colIdx, column);
      return column;
    } else {
      const column = this.columns.get(colIdx)!;
      column.setProperties(props);
      return column;
    }
  }
}