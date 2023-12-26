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

export interface GetStylesOptions {
  /**
   * theme color
   */
  color: string;

  /**
   * Prefix of CSS variables used to store the color of the other theme.
   * @default "--shiki-"
   */
  cssVariablePrefix: string;
}

export interface CreateThemeStyleOptions<Themes extends string = string> {
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

  /**
   * Prefix of CSS variables used to store the color of the other theme.
   * @default '--shiki-'
   */
  cssVariablePrefix?: string;

  /**
   * CSS Scope
   * @default 'scheme'
   */
  scope?: "scheme" | "selector";

  /**
   * Hook to create CSS rules by theme color
   */
  onCreateStyle?: (options: GetStylesOptions) => string;
}

export type OnCreateStyleHook = Required<CreateThemeStyleOptions>["onCreateStyle"];

export type LumeShikijiCodeOptionsThemes<Themes extends string = string> = {
  /**
   * Single theme used
   * @default 'vitesse-light'
   */
  theme: ShikijiThemes<Themes>;
} | CreateThemeStyleOptions<Themes>;

export interface LumeShikijiPluginOptions<Themes extends string = string> {
  extensions?: string[];
  cssSelector?: string;
  shikiji:
    & LumeShikijiCodeOptionsThemes<Themes>
    & {
      /**
       * Inject extra CSS to <head> tag
       */
      extraCSS?: string;

      /**
       * Transform the generated HAST tree.
       */
      transformers?: ShikijiTransformer[];

      /**
       * Language registation
       *
       * @default Object.keys(bundledLanguages)
       */
      langs?: string[];

      /**
       * Alias of languages
       * @example { 'my-lang': 'javascript' }
       */
      langAlias?: Record<string, string>;
    };
}
