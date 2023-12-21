import { merge } from "./deps/lume.ts";
import { ThemeRegistration } from "./deps/shikiji.ts";
import { variables, token, diff, focused, highlighted } from "./styles.ts";

export interface GetStylesOptions {
  theme: string;
  data: ThemeRegistration;
  cssVariablePrefix: string;
  useDefaultTheme: boolean;
}

export interface CreateStylesOptions {
  cssVariablePrefix?: string;
  useDefaultTheme?: boolean;
  useColorScheme?: boolean;
  getStyles?: (options: GetStylesOptions) => string | string[];
}

export const defaults: Required<CreateStylesOptions> = {
  getStyles: (options) => {
    return [
      ...variables(options),
      ...token(options),
      ...highlighted(options),
      ...focused(options),
      ...diff(options),
    ];
  },
  cssVariablePrefix: "--shiki-",
  useDefaultTheme: true,
  useColorScheme: true,
};

export default function createStyles(
  theme: string,
  data: ThemeRegistration,
  options?: CreateStylesOptions,
) {
  const {
    cssVariablePrefix,
    getStyles,
    useColorScheme,
    useDefaultTheme,
  } = merge(defaults, options);

  const styles = getStyles({ theme, data, cssVariablePrefix, useDefaultTheme });

  let css = [styles].flat().join("\n");

  if (useColorScheme) {
    css = `@media (prefers-color-scheme: ${theme}) {\n${css}\n}`;
  }

  return css;
}
