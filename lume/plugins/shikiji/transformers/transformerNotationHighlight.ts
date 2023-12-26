import { OnCreateStyleHook } from "../types.ts";

export {
  transformerNotationHighlight,
  type TransformerNotationHighlightOptions,
} from "../deps/shikiji-transformers.ts";

export const colorsHighlight = {
  light: {
    "highlighted-bg": "rgba(142, 150, 170, .14)",
  },
  dark: {
    "highlighted-bg": "rgba(101, 117, 133, .16)",
  },
};

export const cssRulesHighlight: OnCreateStyleHook = (
  { color, cssVariablePrefix },
) => {
  return `
  .shiki.has-highlighted .line.highlighted {
    display: inline-block;
    width: calc(100% + 48px);
    margin: 0 -24px;
    padding: 0 24px;
    transition: background-color .5s;
  }
  .shiki.has-highlighted .line.highlighted {
    background-color: var(${cssVariablePrefix}${color}-highlighted-bg);
  }`;
};

export const cssRulesHighlightColors: OnCreateStyleHook = (
  { color, cssVariablePrefix },
) => {
  const colors = color.includes("dark")
    ? colorsHighlight.dark
    : colorsHighlight.light;

  const properties = Object.entries(colors).map(([key, value]) =>
    `${cssVariablePrefix}${color}-${key}: ${value}`
  );
  return `
  .shiki.has-highlighted {
    ${properties.join(";\n    ")};
  }`;
};
