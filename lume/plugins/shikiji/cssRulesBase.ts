import { OnCreateStyleHook } from "./types.ts";

export const cssRulesBase: OnCreateStyleHook = (
  { color, cssVariablePrefix },
) => {
  return `
  .shiki {
    background-color: var(${cssVariablePrefix}${color}-bg);
  }
  .shiki span {
    color: var(${cssVariablePrefix}${color});
  }`;
};
