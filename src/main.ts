import { Sheet, Spreadsheet } from "./core";
import "./styles/main.scss";

export const CSS_PREFIX = "sc_" as const;

const createSheetElem = document.getElementById(
  "create_sheet"
) as HTMLButtonElement;
const destroyElem = document.getElementById("destroy") as HTMLButtonElement;
const mountElem = document.getElementById("mount") as HTMLButtonElement;
createSheetElem.addEventListener("click", () => {
  spreadsheet.sheets.createNewSheet();
});
destroyElem.addEventListener("click", () => {
  spreadsheet.destroy();
});
mountElem.addEventListener("click", () => {
  spreadsheet.mount(spreadsheet_container);
});

const spreadsheet = new Spreadsheet();
const spreadsheet_container = document.getElementById(
  "spreadsheet"
) as HTMLDivElement;
spreadsheet.mount(spreadsheet_container);

const sheet = new Sheet({
  name: "Sheet 1",
});

spreadsheet.sheets.addSheet(sheet);
sheet.styles.setStyles("A1", {
  textColor: "red",
});
sheet.data.setValue("A1", "Hello world");

//* Обработчики для моего компонента
spreadsheet.events.addEventListener("cell_change", (event) => {
  console.log(event);
});

spreadsheet.setCellValue("Sheet 1!A1", "First change");
spreadsheet.setCellValue("Sheet 1!A2", "Second change");
spreadsheet.setCellValue("Sheet 1!HILTER1488", "Third change");
spreadsheet.events.addEventListener("cell_styles_change", (event) => {
  console.log(event);
});

spreadsheet.setCellStyles("Sheet 1!A1", {
  textColor: "red",
});

const msArray: number[] = [];
const coordsArray: Array<{ x: number; y: number }> = [];

for (let i = 0; i < 1000; i++) {
  const start = performance.now();
  const cellCoords = spreadsheet.components.table.getCellCoords({
    col: i,
    row: i,
    sheetName: sheet.name,
  });
  const end = performance.now();
  coordsArray.push(cellCoords);
  msArray.push(end - start);
}

let sum = 0;
msArray.forEach(function (num) {
  sum += num;
});
const average = sum / msArray.length;

console.log(`Getter work for ${average} ms!`);
console.log(msArray);
console.log(coordsArray);

