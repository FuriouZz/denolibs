import createThemeStyle from "./createThemeStyle.ts";

import {
  BuiltinLanguage,
  BuiltinTheme,
  BundledHighlighterOptions,
  fromHighlighter,
  getHighlighter,
  Highlighter,
  MarkdownItShikijiSetupOptions,
  merge,
  Page,
  Site,
} from "../deps.ts";

import {
  CommonOptions,
  MultiThemesOptions,
  SingleThemeOptions,
} from "../types.ts";

export default class ShikijiPlugin {
  highlighter: Highlighter;

  constructor(highlighter: Highlighter) {
    this.highlighter = highlighter;
  }

  #createPlugin(
    options: {
      extensions?: string[];
      extraCSS?: string;
      defaultColor?: string | false;
    } & MarkdownItShikijiSetupOptions,
  ) {

    const {
      extensions = [".html"],
      extraCSS,
      defaultColor,
      ...shikiji
    } = options;

    return (site: Site) => {
      const markdownItPlugin = fromHighlighter(this.highlighter, {
        ...shikiji,
        defaultColor: false,
        highlightLines: false,
      });

      site.hooks.addMarkdownItPlugin(markdownItPlugin);

      site.process(extensions, (pages) => {
        pages.forEach((page) => {
          injectCSS(page);
          setDefaultColor(page);
        });
      });

      const injectCSS = (page: Page) => {
        if (!extraCSS) return;
        const style = page.document?.createElement("style");
        if (style) {
          style.textContent = extraCSS;
          page.document?.head.append(style);
        }
      };

      const setDefaultColor = (page: Page) => {
        if (!defaultColor) return;
        const body = page.document?.querySelector("body");
        body?.setAttribute("data-color", defaultColor);
      };
    };
  }

  withSingleTheme<TThemes extends string = string>(
    userOptions?: SingleThemeOptions<TThemes> & CommonOptions,
  ) {
    const options = merge({
      theme: "vitesse-light",
      extensions: [".html"],
      extraCSS: `
      .shiki {
        padding: 24px;
        border-radius: 0.25em;
      }`,
    }, userOptions);

    options.extraCSS += createThemeStyle({ ...options, color: undefined });

    return this.#createPlugin(options);
  }

  withMultiThemes<TThemes extends string = string>(
    userOptions?: MultiThemesOptions<TThemes> & CommonOptions,
  ) {
    const options = merge({
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
      defaultColor: false,
      extensions: [".html"],
      extraCSS: `
      .shiki {
        padding: 24px;
        border-radius: 0.25em;
      }`,
    }, userOptions);

    Object.keys(options.themes).forEach((color) => {
      options.extraCSS += createThemeStyle({ ...options, color });
    });

    return this.#createPlugin(options);
  }

  static async loadHighlighter(
    options?: BundledHighlighterOptions<BuiltinLanguage, BuiltinTheme>,
  ) {
    const highlighter = await getHighlighter(options);
    return new ShikijiPlugin(highlighter);
  }
}
