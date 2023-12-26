import { OnCreateStyleHook } from "../types.ts";

export {
  transformerNotationErrorLevel,
  type TransformerNotationErrorLevelOptions,
} from "../deps/shikiji-transformers.ts";

export const colorsErrorLevel = {
  light: {
    "highlighted-error-bg": "rgba(244, 63, 94, .14)",
    "highlighted-warning-bg": "rgba(234, 179, 8, .14)",
  },
  dark: {
    "highlighted-error-bg": "rgba(244, 63, 94, .16)",
    "highlighted-warning-bg": "rgba(234, 179, 8, .16)",
  },
};

export const cssRulesErrorLevel: OnCreateStyleHook = (
  { color, cssVariablePrefix },
) => {
  return `
  .shiki.has-highlighted .line.highlighted.warning {
    background-color: var(${cssVariablePrefix}${color}-highlighted-warning-bg);
  }
  .shiki.has-highlighted .line.highlighted.error {
    background-color: var(${cssVariablePrefix}${color}-highlighted-error-bg);
  }`;
};

export const cssRulesErrorLevelColors: OnCreateStyleHook = (
  { color, cssVariablePrefix },
) => {
  const colors = color.includes("dark")
    ? colorsErrorLevel.dark
    : colorsErrorLevel.light;

  const properties = Object.entries(colors).map(([key, value]) =>
    `${cssVariablePrefix}${color}-${key}: ${value}`
  );
  return `
  .shiki.has-highlighted {
    ${properties.join(";\n    ")};
  }`;
};
