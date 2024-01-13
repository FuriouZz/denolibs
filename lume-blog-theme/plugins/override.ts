import Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";

export interface Options {
  /**
   * Files that needs to be overrided or created if missing
   * @default {}
   */
  entries: Record<string, string>;
}

export const defaults: Required<Options> = {
  entries: {},
};

export default function override(userOptions?: Options) {
  const { entries } = merge(defaults, userOptions);

  return (site: Site) => {
    for (const [filename, url] of Object.entries(entries)) {
      site.remoteFile(filename, url);
    }
  };
}
