import { Options } from "./types.ts";
import ShikijiPlugin from "./lib/ShikijiPlugin.ts";

export { type Options } from "./types.ts";

export default async function shikiji<
  Themes extends string = string,
>(userOptions: Options<Themes>) {
  const plugin = await ShikijiPlugin.loadHighlighter(userOptions.highlighter);

  if ("theme" in userOptions) {
    return plugin.withSingleTheme(userOptions);
  }

  if ("themes" in userOptions) {
    return plugin.withMultiThemes(userOptions);
  }

  return plugin.withSingleTheme({ theme: "vitesse-light", ...userOptions });
}
