import { fromHighlighter } from "./deps/markdown-it-shikiji.ts";
import { getHighlighter, ShikijiTransformer } from "./deps/shikiji.ts";
import { merge, Page, Site } from "./deps/lume.ts";
import createStyles, { CreateStylesOptions } from "./createStyles.ts";

export interface Options {
  /** The list of extensions this plugin applies to */
  extensions?: string[];

  /** The css selector to apply prism */
  cssSelector?: string;

  /** Append css */
  extraCSS?: string;

  /** Configure theme styling */
  themeStyling?: Omit<CreateStylesOptions, "useDefaultTheme">;

  /** shikiji options */
  shikijiOptions: {
    transformers?: ShikijiTransformer[];
    themes?: Record<string, string>;
    defaultColor?: string | false;
    langs?: string[];
    langAlias?: Record<string, string>;
  };
}

// Default options
export const defaults: Options = {
  extensions: [".html"],
  cssSelector: "pre code",

  extraCSS: `.shiki {
    padding: 24px;
    border-radius: 0.25em;
  }`,

  shikijiOptions: {
    langs: ["javascript"],
    themes: {
      dark: "vitesse-dark",
      light: "vitesse-light",
    },
  },
};

export default async function shikiji(userOptions: Options) {
  const options = merge(defaults, userOptions);
  const shikiji = merge(defaults.shikijiOptions, userOptions.shikijiOptions);

  const highlighter = await getHighlighter({
    themes: Object.values(shikiji.themes) ?? [],
    langs: Object.values(shikiji.langs) ?? [],
  });

  const cssText = [
    options.extraCSS,
    Object.entries(shikiji.themes).map(([name, theme]) => {
      const data = highlighter.getTheme(theme);
      return createStyles(name, data, {
        ...options.themeStyling,
        useDefaultTheme: !!shikiji.defaultColor,
      });
    }),
  ].flat().join("\n\n");

  return (site: Site) => {
console.log(shikiji);


    const markdownItPlugin = fromHighlighter(highlighter, {
      transformers: shikiji.transformers,
      themes: shikiji.themes,
      defaultColor: shikiji.defaultColor,
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
