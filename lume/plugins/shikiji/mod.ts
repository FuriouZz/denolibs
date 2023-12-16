import { merge, Site, Page } from "../../../deps/lume.ts";
import { addClassToHast, getHighlighter, ShikijiTransformer } from "../../../deps/shikiji.ts";

import createCSSTheme from "./createCSSTheme.ts";
import { unescape } from "./utils.ts";

export interface Options {
  /** The list of extensions this plugin applies to */
  extensions?: string[];

  /** The css selector to apply prism */
  cssSelector?: string;

  extraCSS?: string;

  shikijiOptions: {
    transformers?: ShikijiTransformer[];
    /** List of languages */
    langs?: string[];
    langAlias?: Record<string, string>;
    themes?: Record<string, string>;
    defaultColor?: string | false;
    cssVariablePrefix?: string;
    createThemeSelector?: (theme: string) => string;
  };
}

// Default options
export const defaults: Options = {
  extensions: [".html"],
  cssSelector: "pre code",

  extraCSS: `.shiki {
    padding: 0.5em;
    border-radius: 0.25em;
  }`,

  shikijiOptions: {
    langs: ["javascript"],
    defaultColor: "light",
    themes: {
      dark: "vitesse-dark",
      light: "vitesse-light",
    },
  },
};

export default async (userOptions?: Options) => {
  const options = merge(defaults, userOptions);
  const shikijiOptions = merge(defaults.shikijiOptions, options.shikijiOptions);

  const highlighter = await getHighlighter({
    themes: Object.values(shikijiOptions.themes),
    langs: shikijiOptions.langs,
  });

  const cssText = [
    options.extraCSS,
    ...Object.keys(shikijiOptions.themes).map((theme) =>
      createCSSTheme(theme, shikijiOptions)
    ),
  ].join("\n\n");

  return (site: Site) => {
    site.process(options.extensions, (pages) => pages.forEach(highlight));

    const highlight = (page: Page) => {
      // Add CSS styles
      const style = page.document!.createElement("style");
      style.textContent = cssText;
      page.document!.head.append(style);

      // Highlight
      page
        .document!.querySelectorAll(options.cssSelector!)
        .forEach((element) => {
          const matches = element.className.match(/language-(\w+)/);
          if (matches) {
            const lang = matches[1];
            const div = page.document!.createElement("div");
            div.innerHTML = highlighter.codeToHtml(
              unescape(element.innerHTML),
              {
                lang,
                themes: shikijiOptions.themes,
                defaultColor: shikijiOptions.defaultColor,
                transformers: [
                  {
                    code(node: Parameters<typeof addClassToHast>[0]) {
                      addClassToHast(node, `language-${lang}`);
                    },
                  },
                  ...shikijiOptions.transformers,
                ],
              },
            );
            element.replaceWith(div.querySelector("code")!);
          }
        });
    };
  };
};
