export type SheetDataType = Map<string, string>;

export type SheetDataConstructorProps = {
  initialData?: SheetDataType;
};

export class SheetData {
  private _data: SheetDataType;

  public get data(): SheetDataType {
    return this._data;
  }

  constructor(props: SheetDataConstructorProps) {
    if (props && props.initialData) this._data = props.initialData;
    else this._data = new Map();
  }

  getValue(address: string): string | null {
    const value = this.data.get(address);
    if(!value) return null;
    return value;
  }

  setValue(address: string, value: string): void {
    this._data.set(address, value);
  }
}
