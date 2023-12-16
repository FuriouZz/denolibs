export type CreateThemeOptions = {
  cssVariablePrefix?: string;
  createThemeSelector?: (theme: string) => string;
};

export default function createCSSTheme(
  theme: string,
  userOptions?: CreateThemeOptions,
) {
  const options: typeof userOptions = {
    cssVariablePrefix: "--shiki",
    ...userOptions,
  };

  let css = [
    `color: var(${options.cssVariablePrefix}-dark) !important`,
    `background-color: var(${options.cssVariablePrefix}-dark-bg) !important`,
    `font-style: var(${options.cssVariablePrefix}-dark-font-style) !important`,
    `font-weight: var(${options.cssVariablePrefix}-dark-font-weight) !important`,
    `text-decoration: var(${options.cssVariablePrefix}-dark-text-decoration) !important`,
  ].join(";\n");

  if (options.createThemeSelector) {
    const selector = options.createThemeSelector
      ? options.createThemeSelector(theme)
      : `html.${theme}`;

    css = [
      `${selector} .shiki,`,
      `${selector} .shiki span`,
      `{\n${css}\n}`,
    ].join("\n");
  } else {
    css = [
      `@media (prefers-color-scheme: ${theme}) {`,
      ".shiki, .shiki span",
      `{\n${css}\n}`,
      "}",
    ].join("\n");
  }

  return css;
}
