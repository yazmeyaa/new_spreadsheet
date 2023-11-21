import { CellReference } from "../core/cell";

const ADDRESS_SYMBOLS = {
  sheetName: "!",
  range: ":",
} as const;

/**
 * Converts an address string representing an Excel-like cell reference into its corresponding
 * column and row indices.
 *
 * @param {string} address - The address string in the format "A1", "B2", etc.
 * @throws {Error} If the address is not in the expected format.
 * @throws {Error} If the extraction of letters or digits from the address fails.
 * @returns {CellReference | null} - The object containing column and row indices or null if the address is invalid.
 */
export function getCellReference(
  address: string
): CellReference | null | never {
  const addressRegex = /^([a-zA-Z\s\d]+\!)?([a-zA-Z]+)(\d+)$/;
  const isAddressValid = addressRegex.test(address);

  if (!isAddressValid) {
    throw new Error("Invalid address format");
  }

  const matches = address.match(addressRegex);
  let sheetName = matches?.[1];
  const letters = matches?.[2];
  const digits = matches?.[3];

  if (!letters || !digits || !sheetName) {
    throw new Error("Failed to extract letters or digits from the address");
  }

  sheetName = sheetName.slice(0, -1);
  const col = convertLettersToDigits(letters);
  const row = Number(digits) - 1;

  return { col, row, sheetName: sheetName };
}

/**
 * Converts a string representing an Excel-like column into its corresponding number.
 * For example, A = 0, AA = 27.
 *
 * @param {string} string - The string representing the Excel-like column.
 * @returns {number} - The numeric representation of the column.
 */
export function convertLettersToDigits(string: string): number {
  let result = 0;

  for (let i = 0; i < string.length; i++) {
    const charCode = string.charCodeAt(i) - 65;
    result = result * 26 + charCode + 1;
  }

  return result - 1;
}

/**
 * Converts an object with column and row indices into an Excel cell address.
 *
 * @param {Object} cellReference - Object with column and row indices.
 * @returns {string} - Excel cell address, e.g., "A1".
 */
export function getCellAddress(cellReference: CellReference): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let sheetName = cellReference.sheetName
    ? cellReference.sheetName + ADDRESS_SYMBOLS.sheetName
    : "";
  let colIndex = cellReference.col;
  let rowIndex = cellReference.row + 1;

  let colAddress = "";
  while (colIndex >= 0) {
    colAddress = alphabet[colIndex % 26] + colAddress;
    colIndex = Math.floor(colIndex / 26) - 1;
  }

  return sheetName + colAddress + rowIndex;
}

export function removeSheetNameFromAddress(address: string): string {
  if (address.includes(ADDRESS_SYMBOLS.sheetName)) {
    const parts = address.split(ADDRESS_SYMBOLS.sheetName);
    return parts[parts.length - 1];
  } else return address;
}
