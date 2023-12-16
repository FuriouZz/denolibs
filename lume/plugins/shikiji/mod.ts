import { fromHighlighter } from "./deps/markdown-it-shikiji.ts";
import { getHighlighter, ShikijiTransformer } from "./deps/shikiji.ts";
import { merge, Page, Site } from "./deps/lume.ts";
import createCSSTheme from "./createCSSTheme.ts";

export interface Options {
  /** The list of extensions this plugin applies to */
  extensions?: string[];

  /** The css selector to apply prism */
  cssSelector?: string;

  extraCSS?: string;
  createThemeSelector?: (theme: string) => string;

  transformers?: ShikijiTransformer[];
  langs?: string[];
  langAlias?: Record<string, string>;
  themes?: Record<string, string>;
  defaultColor?: string | false;
  cssVariablePrefix?: string;
}

// Default options
export const defaults: Options = {
  extensions: [".html"],
  cssSelector: "pre code",

  extraCSS: `.shiki {
    padding: 0.5em;
    border-radius: 0.25em;
  }`,

  langs: ["javascript"],
  defaultColor: "light",
  themes: {
    dark: "vitesse-dark",
    light: "vitesse-light",
  },
};

export default async function shikiji(userOptions: Options) {
  const options = merge(defaults, userOptions);

  const highlighter = await getHighlighter({
    themes: Object.values(options.themes) ?? [],
    langs: Object.values(options.langs) ?? [],
  });

  const cssText = [
    options.extraCSS,
    ...Object.keys(options.themes).map((theme) =>
      createCSSTheme(theme, options)
    ),
  ].join("\n\n");

  return (site: Site) => {
    const markdownItPlugin = fromHighlighter(highlighter, {
      transformers: options.transformers,
      themes: options.themes,
      defaultColor: options.defaultColor,
      highlightLines: false,
    });

    site.hooks.addMarkdownItPlugin(markdownItPlugin);

    site.process(options.extensions, (pages) => pages.forEach(injectCSS));

    const injectCSS = (page: Page) => {
      const style = page.document!.createElement("style");
      style.textContent = cssText;
      page.document!.head.append(style);
    };
  };
}
