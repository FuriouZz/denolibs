import lume from "https://deno.land/x/lume@v2.0.1/mod.ts";
import shikiji from "../mod.ts";
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
    themes: {
      light: "github-light",
      dark: "github-dark"
    },
    defaultColor: "light",
    langs: ["javascript"],
    scope: "selector",
    onCreateStyle: (options) =>
      [
        cssRulesDiff(options),
        cssRulesErrorLevel(options),
        cssRulesFocus(options),
        cssRulesHighlight(options),
      ].join("\n"),
    transformers: [
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationFocus(),
      transformerNotationHighlight(),
    ],
  }),
);

export default site;
