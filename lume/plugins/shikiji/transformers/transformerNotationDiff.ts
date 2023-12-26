import { OnCreateStyleHook } from "../types.ts";

export {
  transformerNotationDiff,
  type TransformerNotationDiffOptions,
} from "../deps/shikiji-transformers.ts";

export const colorsDiff = {
  light: {
    "diff-add-bg": "rgba(16, 185, 129, .14)",
    "diff-remove-bg": "rgba(244, 63, 94, .14)",
  },
  dark: {
    "diff-add-bg": "rgba(16, 185, 129, .16)",
    "diff-remove-bg": "rgba(244, 63, 94, .16)",
  },
};

export const cssRulesDiff: OnCreateStyleHook = (
  { color, cssVariablePrefix },
) => {
  return `
  .shiki.has-diff .line.diff {
    display: inline-block;
    width: calc(100% + 48px);
    margin: 0 -24px;
    padding: 0 24px;
    transition: background-color .5s;
  }
  .shiki.has-diff .line.diff.add {
    background-color: var(${cssVariablePrefix}${color}-diff-add-bg);
  }
  .shiki.has-diff .line.diff.remove {
    background-color: var(${cssVariablePrefix}${color}-diff-remove-bg);
  }`;
};

export const cssRulesDiffColors: OnCreateStyleHook = (
  { color, cssVariablePrefix },
) => {
  const colors = color.includes("dark") ? colorsDiff.dark : colorsDiff.light;

  const properties = Object.entries(colors).map(([key, value]) =>
    `${cssVariablePrefix}${color}-${key}: ${value}`
  );
  return `
  .shiki.has-diff {
    ${properties.join(";\n    ")};
  }`;
};
