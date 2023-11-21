import { Spreadsheet } from "../../core";
import { ToolbarGroup } from "../toolbar";
import { createStylesGroup } from "./styles_group";

const groups = {
  styles: createStylesGroup,
} as const;

export type GroupsKeys = keyof typeof groups;
export type GroupsValues = (typeof groups)[GroupsKeys];

export function getToolbarGroup(
  group: GroupsKeys,
  root: Spreadsheet
): ToolbarGroup {
  return groups[group](root);
}
