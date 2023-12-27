import {
  BuiltinLanguage,
  BuiltinTheme,
  BundledHighlighterOptions,
  ShikijiTransformer,
  StringLiteralUnion,
  ThemeRegistration,
  ThemeRegistrationRaw,
} from "./deps.ts";

export type ShikijiThemes<Themes extends string = string> =
  | ThemeRegistration
  | ThemeRegistrationRaw
  | StringLiteralUnion<Themes>;

export interface CreateThemeStyleOptions {
  /**
   * Theme color
   * @default ''
   */
  color?: string;

  /**
   * Prefix of CSS variables used to store the color of the other theme.
   * @default '--shiki-'
   */
  cssVariablePrefix?: string;

  /**
   * Hook to create CSS rules by theme color
   */
  themeStyles?: OnCreateStyleHook[];

  /**
   * Use prefers-color-scheme to use dark/light mode
   */
  useColorScheme?: boolean;
}

export interface GetStylesOptions {
  /**
   * Theme color to style
   */
  color: string;

  /**
   * Prefix of CSS variables used to store the color of the other theme.
   * @default '--shiki-'
   */
  cssVariablePrefix: string;
}

export type OnCreateStyleHook = (options: GetStylesOptions) => string;

export interface SingleThemeOptions<Themes extends string = string> {
  /**
   * Single theme used
   * @default 'vitesse-light'
   */
  theme: ShikijiThemes<Themes>;
}

export interface MultiThemesOptions<Themes extends string = string> {
  /**
   * A map of color names to themes.
   * This allows you to specify multiple themes for the generated code.
   *
   * @see https://github.com/antfu/shikiji#lightdark-dual-themes
   */
  themes?: Record<string, ShikijiThemes<Themes>>;

  /**
   * Add [data-color] attribute to body element
   *
   * @default false
   */
  defaultColor?: string | false;
}

export type OptionsThemes<Themes extends string = string> =
  | SingleThemeOptions<Themes>
  | MultiThemesOptions<Themes>;

export type Options<TThemes extends string = string> =
  & {
    highlighter?: BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme>;
  }
  & CommonOptions
  & OptionsThemes<TThemes>;

export interface CommonOptions extends Omit<CreateThemeStyleOptions, "scope"> {
  /**
   * The list of extensions this plugin applies to
   * @default [".html"]
   */
  extensions?: string[];

  /**
   * Inject extra CSS to <head> tag
   * @default ".shiki {padding: 24px;border-radius: 0.25em;}"
   */
  extraCSS?: string;

  /**
   * Transform the generated HAST tree.
   */
  transformers?: ShikijiTransformer[];
}

export interface OnTransformerCSSRulesOptions {
  addColors: boolean;
}
