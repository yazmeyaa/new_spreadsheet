import { Spreadsheet } from "../../core";
import { ToolbarGroup } from "../toolbar";

export function createStylesGroup(root: Spreadsheet): ToolbarGroup {
  const stylesGroup = new ToolbarGroup({
    name: "Styles",
    root,
  });

  stylesGroup.addButton("Text color", (event, spreadsheet) => {
    event.preventDefault();
    const cell = spreadsheet.sheets.activeSheet?.getCell("A1");
    console.log(cell);
  });

  stylesGroup.addButton('Background color', (event, spreadsheet) => {
    event.preventDefault();
    const cell = spreadsheet.sheets.activeSheet?.getCell("A2");
    console.log(cell);
  })

  return stylesGroup;
}
