import { merge } from "lume/core/utils/object.ts";
import { Page } from "lume/core/file.ts";
import Site from "lume/core/site.ts";

export interface Options {
  /**
   * HTML attribute to use for labeling
   * @default "label"
   */
  attribute?: string;

  /**
   * Label format
   * @default "// $FILENAME\n"
   */
  format?: string;

  /**
   * Label position
   * @default "top"
   */
  position: "top" | "bottom";

  /**
   * Inline CSS
   */
  css?: string;
}

export const defaults = {
  attribute: "label",
  format: `// $FILENAME\n`,
  position: "top" as "top" | "bottom",
  css: [
    "opacity: 0.5",
    "font-style: italic",
    "padding-bottom: 1em",
    "font-size: 1em",
    "pointer-events: none",
    "user-select: none",
  ].join(";"),
};

export default function showLabel(userOptions?: Options) {
  const { attribute, format, css, position } = merge(defaults, userOptions);

  return (site: Site) => {
    site.process([".html"], (pages) => {
      pages.forEach(createLabel);
    });

    function createLabel(page: Page) {
      page.document!.querySelectorAll(`pre code[${attribute}]`).forEach((element) => {
        const file = element.getAttribute(attribute)!;
        element.removeAttribute(attribute);

        const div = page.document!.createElement("div");
        div.textContent = format.replaceAll(`$FILENAME`, file);
        div.setAttribute("style", css);

        element.parentElement
          ?.[position === "top" ? "prepend" : "append"](div);
      });
    }
  };
}
