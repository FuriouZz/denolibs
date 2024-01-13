import Site from "lume/core/site.ts";
import { merge } from "lume/core/utils/object.ts";
import { walkSync } from "lume/deps/fs.ts";
import { fromFileUrl, toFileUrl, relative } from "lume/deps/path.ts";

export interface Options {
  /**
   * Root path where files are located
   * @default "./_override"
   */
  path: string;

  /**
   * Files that needs to be overrided or created if missing
   * @default []
   */
  ignores?: RegExp[];
}

export const defaults: Required<Options> = {
  path: "./_override",
  ignores: [],
};

export default function override(userOptions?: Options) {
  const { path, ignores: skip } = merge(defaults, userOptions);

  return (site: Site) => {
    for (const entry of walkSync(fromFileUrl(path), {
      includeDirs: false,
      skip,
    })) {
      const src = toFileUrl(entry.path).toString();
      site.remoteFile("/" + relative(path, src), src);
    }
  };
}
