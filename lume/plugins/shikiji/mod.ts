import { fromHighlighter } from "./deps/markdown-it-shikiji.ts";
import { bundledLanguages, getHighlighter } from "./deps/shikiji.ts";
import { merge, Page, Site } from "./deps/lume.ts";
import createThemeStyle from "./createThemeStyle.ts";
import {
  CreateThemeStyleOptions,
  LumeShikijiPluginOptions,
  ShikijiThemes,
} from "./types.ts";

export * from "./types.ts";

// Default options
export const defaults: LumeShikijiPluginOptions = {
  extensions: [".html"],
  shikiji: {
    theme: "vitesse-light",
    extraCSS: `
    .shiki {
      padding: 24px;
      border-radius: 0.25em;
    }
    `,
  },
};

export default async function lumeShikijiPlugin<
  Themes extends string = string,
>(userOptions: LumeShikijiPluginOptions<Themes>) {
  const options = merge(defaults, userOptions);

  const shikiji = merge(defaults.shikiji, userOptions.shikiji);

  // Delete default theme field
  if (
    "themes" in userOptions.shikiji && !("theme" in userOptions.shikiji)
  ) {
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    delete shikiji.theme;
  }

  const themes: ShikijiThemes<Themes>[] = [];
  const langs: string[] = shikiji.langs ?? Object.keys(bundledLanguages);
  const cssRules = [shikiji.extraCSS ?? ""];

  let defaultColor: string | false = false;
  let scope: CreateThemeStyleOptions["scope"] = "scheme";

  if ("theme" in shikiji) {
    themes.push(shikiji.theme);
  } else if ("themes" in shikiji) {
    themes.push(...Object.values(shikiji.themes));

    defaultColor = shikiji.defaultColor;
    scope = shikiji.scope ?? defaultColor ? "selector" : "scheme";
    if (defaultColor && scope === "scheme") {
      console.warn(
        `Because of defaultColor property is setted, scope value is overrided with:  "selector"`,
      );
      scope = "selector";
    }

    const rules = Object.keys(shikiji.themes).map((color) => {
      return createThemeStyle(color, shikiji);
    });
    cssRules.push(...rules);
  }

  const highlighter = await getHighlighter({ themes, langs });
  const cssText = cssRules.join("\n");

  const injectCSS = (page: Page) => {
    const style = page.document?.createElement("style");
    if (style) {
      style.textContent = cssText;
      page.document?.head.append(style);
    }
  };

  const setDefaultColor = (page: Page) => {
    if (defaultColor && scope === "selector") {
      const body = page.document?.querySelector("body");
      body?.setAttribute("data-color", defaultColor);
    }
  };

  return (site: Site) => {
    const markdownItPlugin = fromHighlighter(highlighter, {
      ...shikiji,
      defaultColor: false,
      highlightLines: false,
    });

    site.hooks.addMarkdownItPlugin(markdownItPlugin);

    site.process(options.extensions, (pages) => {
      pages.forEach((page) => {
        injectCSS(page);
        setDefaultColor(page);
      });
    });
  };
}
