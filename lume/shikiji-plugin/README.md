# Shikiji plugin for [Lume](https://lume.land/)

This plugin uses the [shikiji](https://shikiji.netlify.app/) library to search and syntax
highlight the code of any `<pre><code>` element.

## Installation

Import this plugin in your `_config.ts` file to use it:

```ts
import lume from "https://deno.land/x/lume/mod.ts";
import shikiji from "https://deno.land/x/furiouzz/lume/plugins/shikiji/mod.ts";

import {
  cssRulesDiff,
  cssRulesErrorLevel,
  cssRulesFocus,
  cssRulesHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from "../transformers/mod.ts";

const site = lume();

site.use(
  await shikiji({
    highlighter: {
      langs: ["javascript"],
      themes: ["github-light"],
    },

    theme: "github-light",

    themeStyles: [
      cssRulesDiff,
      cssRulesErrorLevel,
      cssRulesFocus,
      cssRulesHighlight,
    ],

    transformers: [
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationFocus(),
      transformerNotationHighlight(),
    ],
  })
);

export default site;
```

## Common Options

```ts
const options: {
  /**
   * The list of extensions this plugin applies to
   * @default [".html"]
   */
  extensions?: string[];

  /**
   * Highlighter options to configure theme and languages to load
   */
  highlighter?: BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme>;

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
```

## Single theme options

```ts
const options: {
  // ...common options

  /**
   * Single theme used
   * @default 'vitesse-light'
   */
  theme: ShikijiThemes<Themes>;
}
```

## Multi themes options

```ts
const options: {
  // ...common options

  /**
   * A map of color names to themes.
   * This allows you to specify multiple themes for the generated code.
   *
   * @see https://github.com/antfu/shikiji#lightdark-dual-themes
   */
  themes?: Record<string, ShikijiThemes<Themes>>;

  /**
   * Add [data-color] attribute to body element
   * It does not work like shikiji implementation
   *
   * @default false
   */
  defaultColor?: string | false;
}
```