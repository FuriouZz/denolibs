import { merge } from "./deps/lume.ts";
import { cssRulesBase } from "./cssRulesBase.ts";
import { CreateThemeStyleOptions } from "./types.ts";

export const defaults: Required<CreateThemeStyleOptions> = {
  color: "",
  cssVariablePrefix: "--shiki-",
  scope: "scheme",
  onCreateStyle: () => "",
};

export default function createThemeStyle(
  options?: CreateThemeStyleOptions,
) {
  const {
    color,
    cssVariablePrefix,
    scope,
    onCreateStyle,
  } = merge(defaults, options);

  let _cssVariablePrefix = cssVariablePrefix;
  if (color) _cssVariablePrefix += color;

  let css = cssRulesBase({ color, cssVariablePrefix: _cssVariablePrefix });

  if (onCreateStyle) {
    css += onCreateStyle({ color, cssVariablePrefix: _cssVariablePrefix });
  }

  if (color) {
    if (scope === "selector") {
      css = css.replaceAll(".shiki", `[data-color=${color}] .shiki`);
    } else if (scope === "scheme") {
      css = `@media (prefers-color-scheme: ${color}) {\n${css}\n}`;
    }
  }

  return css;
}
