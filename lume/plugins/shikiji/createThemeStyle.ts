import { merge } from "./deps/lume.ts";
import { cssRulesBase } from "./cssRulesBase.ts";
import { CreateThemeStyleOptions } from "./types.ts";

export const defaults: Required<CreateThemeStyleOptions> = {
  themes: {
    light: "vitesse-light",
    dark: "vitesse-dark",
  },
  defaultColor: "light",
  cssVariablePrefix: "--shiki-",
  scope: "scheme",
  onCreateStyle: () => "",
};

export default function createThemeStyle(
  color: string,
  options?: CreateThemeStyleOptions,
) {
  const {
    cssVariablePrefix,
    scope,
    onCreateStyle,
  } = merge(defaults, options);

  let css = cssRulesBase({ color, cssVariablePrefix });

  if (onCreateStyle) {
    css += onCreateStyle({ color, cssVariablePrefix });
  }

  if (scope === "selector") {
    css = css.replaceAll(".shiki", `[data-color=${color}] .shiki`);
  } else {
    css = `@media (prefers-color-scheme: ${color}) {\n${css}\n}`;
  }

  return css;
}
