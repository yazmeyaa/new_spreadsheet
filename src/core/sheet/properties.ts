const defaultRowProps: Required<RowConstructorProps> = {
  height: 25,
} as const;

const defaultColumnProps: Required<ColumnsConstructorProps> = {
  width: 100,
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
    if (props) {
      if(props.width) this._width = props.width
    }
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
    if (props) {
      if(props.height) this._height = props.height
    }
  }
}

export class SheetProperties {
  private columns: Map<number, Column> = new Map();
  private rows: Map<number, Row> = new Map();
  public readonly DEFAULT_ROW_SIZE = defaultRowProps.height;
  public readonly DEFAULT_COLUMN_SIZE = defaultColumnProps.width;

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

  public setRow(rowIdx: number, props?: RowConstructorProps): Row {
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

  public setColumn(colIdx: number, props?: ColumnsConstructorProps): Column {
    if (this.columns.has(colIdx) === false) {
      const column = new Column(props);
      this.columns.set(colIdx, column);
      return column;
    } else {
      const column = this.columns.get(colIdx)!;
      column.setProperties(props);
      return column;
    }
  }

  public getAllRows(): Row[] {
    return Array.from(this.rows.values());
  }

  public getAllRowsKeys(): number[] {
    return Array.from(this.rows.keys());
  }

  public getAllColumnsKeys(): number[] {
    return Array.from(this.columns.keys());
  }

  public getAllColumns(): Column[] {
    return Array.from(this.columns.values());
  }
}
