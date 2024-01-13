import date, { Options as DateOptions } from "lume/plugins/date.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import metas from "lume/plugins/metas.ts";
import pagefind, { Options as PagefindOptions } from "lume/plugins/pagefind.ts";
import sitemap from "lume/plugins/sitemap.ts";
import feed from "lume/plugins/feed.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import transform_images from "lume/plugins/transform_images.ts";

import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import image from "https://deno.land/x/lume_markdown_plugins@v0.7.0/image.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins@v0.7.0/footnotes.ts";

import emoji from "./plugins/emoji.ts";
import showLabel from "./plugins/showLabel.ts";
import shikiji, {
  shikijiExtra,
  Options as ShikijiOptions,
} from "./plugins/shikiji.ts";

import "lume/types.ts";

export interface Options {
  shikiji?: ShikijiOptions;
  date?: Partial<DateOptions>;
  pagefind?: Partial<PagefindOptions>;
}

/** Configure the site */
export default function (options: Options = {}) {
  return (site: Lume.Site) => {
    site
      .use(postcss())
      .use(basePath())
      .use(toc())
      .use(readingInfo())
      .use(date(options.date))
      .use(metas())
      .use(image())
      .use(footnotes())
      .use(resolveUrls())
      .use(slugifyUrls())
      .use(terser())
      .use(pagefind(options.pagefind))
      .use(sitemap())
      .use(emoji())
      .use(transform_images())
      .use(showLabel())
      .use(
        shikiji(
          options.shikiji ?? {
            highlighter: {
              themes: ["github-dark", "github-light"],
              langs: [
                "javascript",
                "yaml",
                "markdown",
                "bash",
                "json",
                "typescript",
                "css",
              ],
            },
            themes: {
              dark: "github-dark",
              light: "github-light",
            },
            cssFile: "/styles/shikiji.css",
            useColorScheme: true,
          }
        )
      )
      .use(shikijiExtra({ copyFiles: true }))
      .use(
        feed({
          output: ["/feed.xml", "/feed.json"],
          query: "type=post",
          info: {
            title: "=metas.site",
            description: "=metas.description",
          },
          items: {
            title: "=title",
          },
        })
      )
      .copy("fonts")
      .copy("js")
      // .copy("favicon.png")
      .preprocess([".md"], (pages) => {
        for (const page of pages) {
          page.data.excerpt ??= (page.data.content as string).split(
            /<!--\s*more\s*-->/i
          )[0];
        }
      });

    // Basic CSS Design System
    site.remoteFile(
      "_includes/css/ds.css",
      "https://unpkg.com/@lumeland/ds@0.4.0/ds.css"
    );

    // Mastodon comment system
    site.remoteFile(
      "/js/comments.js",
      "https://unpkg.com/@oom/mastodon-comments@0.2.1/src/comments.js"
    );
  };
}
