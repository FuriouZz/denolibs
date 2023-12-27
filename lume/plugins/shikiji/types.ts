import {
  ShikijiTransformer,
  StringLiteralUnion,
  ThemeRegistration,
  ThemeRegistrationRaw,
} from "./deps/shikiji.ts";

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
   * CSS Scope
   * @default 'scheme'
   */
  scope?: "scheme" | "selector" | false;

  /**
   * Hook to create CSS rules by theme color
   */
  onCreateStyle?: (options: GetStylesOptions) => string;
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

export type OnCreateStyleHook = Required<
  CreateThemeStyleOptions
>["onCreateStyle"];

export interface LumeShikijiSingleTheme<Themes extends string = string>
  extends CreateThemeStyleOptions {
  /**
   * Single theme used
   * @default 'vitesse-light'
   */
  theme: ShikijiThemes<Themes>;
}

export interface LumeShikijiMultiThemes<Themes extends string = string>
  extends CreateThemeStyleOptions {
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

export type LumeShikijiCodeOptionsThemes<Themes extends string = string> =
  | LumeShikijiSingleTheme<Themes>
  | LumeShikijiMultiThemes<Themes>;

export type LumeShikijiPluginOptions<Themes extends string = string> =
  & LumeShikijiCodeOptionsThemes<Themes>
  & {
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

    /**
     * Language registation
     * @default Object.keys(bundledLanguages)
     */
    langs?: string[];

    /**
     * Alias of languages
     * @example {"my-lang":"javascript"}
     */
    langAlias?: Record<string, string>;
  };

export interface OnTransformerCSSRulesOptions {
  addColors: boolean
}
