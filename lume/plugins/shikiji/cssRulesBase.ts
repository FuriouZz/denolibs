import { OnCreateStyleHook } from "./types.ts";

export const cssRulesBase: OnCreateStyleHook = (
  { cssVariablePrefix },
) => {
  return `
  .shiki {
    background-color: var(${cssVariablePrefix}-bg);
  }
  .shiki span {
    color: var(${cssVariablePrefix});
  }`;
};
