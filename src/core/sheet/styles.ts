import { removeSheetNameFromAddress } from "../../helpers";

export interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export interface CellBorder {
  left: Border | null;
  right: Border | null;
  top: Border | null;
  bottom: Border | null;
}

export type BorderType = "normal" | "bold";

export interface Border {
  color: string;
  type: BorderType;
}

export interface CellStyleConstructorProps {
  textColor?: string;
  backgroundColor?: string;
  textSize?: number;
  textStyle?: TextStyle;
  border?: CellBorder;
}

type StylePropsKeys = keyof CellStyleConstructorProps;

export class CellStyle {
  public textColor: string;
  public backgroundColor: string;
  public textSize: number;
  public textStyle: TextStyle;
  public border: CellBorder;

  constructor(props?: CellStyleConstructorProps) {
    this.textColor = this.getProperty("textColor", props?.textColor);
    this.backgroundColor = this.getProperty(
      "backgroundColor",
      props?.backgroundColor
    );
    this.textSize = this.getProperty("textSize", props?.textSize);
    this.textStyle = this.getProperty("textStyle", props?.textStyle);
    this.border = this.getProperty("border", props?.border);
  }
  private getProperty<
    K extends StylePropsKeys,
    V = CellStyleConstructorProps[K]
  >(key: K, value?: V): V {
    const defaultStyles = createDefaultCellStyles();
    if (!value) return defaultStyles[key] as V;
    else return value;
  }

  public setStyle(style: CellStyleConstructorProps): CellStyle {
    Object.assign(this, style);
    return this;
  }
}

export class SheetStyles {
  private styles: Map<string, CellStyle> = new Map();

  public getStyles(address: string): CellStyle | null {

    address = removeSheetNameFromAddress(address);
    const style = this.styles.get(address);
    if (!style) return null;
    return style;
  }

  public setStyles(
    address: string,
    styles: CellStyleConstructorProps
  ): CellStyle | null {
    const cell = this.getStyles(address);
    if (!cell) {
      const newStyles = new CellStyle(styles)
      this.styles.set(address, newStyles);
      return newStyles
    }

    cell.setStyle(styles);
    return cell;
  }
}

function createDefaultBorderStyles(): CellBorder {
  return {
    bottom: null,
    left: null,
    right: null,
    top: null,
  };
}

function createDefaultCellStyles(): Required<CellStyleConstructorProps> {
  const defaultCellStyles: Required<CellStyleConstructorProps> = {
    backgroundColor: "#fff",
    textColor: "#000",
    textStyle: {
      bold: false,
      italic: false,
      underline: false,
    },
    textSize: 12,
    border: createDefaultBorderStyles(),
  };

  return defaultCellStyles;
}
