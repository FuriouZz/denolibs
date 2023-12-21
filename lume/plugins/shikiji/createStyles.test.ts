import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import createStyles from "./createStyles.ts";
import { getHighlighter } from "./deps/shikiji.ts";

async function getTheme() {
  const highlighter = await getHighlighter({
    themes: ["github-dark"],
  });
  return highlighter.getTheme("github-dark");
}

Deno.test(
  "create dark theme",
  { permissions: { env: true } },
  async () => {
    const theme = await getTheme();
    const expected =
      "@media (prefers-color-scheme: dark) {.shiki {--shiki-dark-highlighted-bg: rgba(101, 117, 133, .16);--shiki-dark-highlighted-error-bg: rgba(244, 63, 94, .16);--shiki-dark-highlighted-warning-bg: rgba(234, 179, 8, .16);--shiki-dark-diff-add-bg: rgba(16, 185, 129, .16);--shiki-dark-diff-remove-bg: rgba(244, 63, 94, .16);}.shiki span {color: var(--shiki-dark) !important;background-color: var(--shiki-dark-bg) !important;}.shiki.has-highlighted .line.highlighted {background-color: var(--shiki-dark-highlighted-bg) !important;}.shiki.has-highlighted .line.highlighted.warning {background-color: var(--shiki-dark-highlighted-warning-bg) !important;}.shiki.has-highlighted .line.highlighted.error {background-color: var(--shiki-dark-highlighted-error-bg) !important;}.shiki.has-focused .line:not(.focused) {filter: blur(.095rem);opacity: .7;transition: filter .35s,opacity .35s;}.shiki.has-focused:hover .line:not(.focused) {filter: blur(0);opacity: 1;}.shiki.has-diff .line.diff.add {background-color: var(--shiki-dark-diff-add-bg) !important;}.shiki.has-diff .line.diff.remove {background-color: var(--shiki-dark-diff-remove-bg) !important;}}";
    assertEquals(createStyles("dark", theme).replaceAll("\n", ""), expected);
  },
);

Deno.test("useDefaultTheme=false", { permissions: { env: true } }, async () => {
  const theme = await getTheme();
  const expected =
    "@media (prefers-color-scheme: dark) {.shiki {--shiki-dark-highlighted-bg: rgba(101, 117, 133, .16);--shiki-dark-highlighted-error-bg: rgba(244, 63, 94, .16);--shiki-dark-highlighted-warning-bg: rgba(234, 179, 8, .16);--shiki-dark-diff-add-bg: rgba(16, 185, 129, .16);--shiki-dark-diff-remove-bg: rgba(244, 63, 94, .16);}.shiki span {color: var(--shiki-dark);background-color: var(--shiki-dark-bg);}.shiki.has-highlighted .line.highlighted {background-color: var(--shiki-dark-highlighted-bg);}.shiki.has-highlighted .line.highlighted.warning {background-color: var(--shiki-dark-highlighted-warning-bg);}.shiki.has-highlighted .line.highlighted.error {background-color: var(--shiki-dark-highlighted-error-bg);}.shiki.has-focused .line:not(.focused) {filter: blur(.095rem);opacity: .7;transition: filter .35s,opacity .35s;}.shiki.has-focused:hover .line:not(.focused) {filter: blur(0);opacity: 1;}.shiki.has-diff .line.diff.add {background-color: var(--shiki-dark-diff-add-bg);}.shiki.has-diff .line.diff.remove {background-color: var(--shiki-dark-diff-remove-bg);}}";
  assertEquals(
    createStyles("dark", theme, { useDefaultTheme: false }).replaceAll(
      "\n",
      "",
    ),
    expected,
  );
});

Deno.test("useColorScheme=false", { permissions: { env: true } }, async () => {
  const theme = await getTheme();
  const expected =
    ".shiki {--shiki-dark-highlighted-bg: rgba(101, 117, 133, .16);--shiki-dark-highlighted-error-bg: rgba(244, 63, 94, .16);--shiki-dark-highlighted-warning-bg: rgba(234, 179, 8, .16);--shiki-dark-diff-add-bg: rgba(16, 185, 129, .16);--shiki-dark-diff-remove-bg: rgba(244, 63, 94, .16);}.shiki span {color: var(--shiki-dark) !important;background-color: var(--shiki-dark-bg) !important;}.shiki.has-highlighted .line.highlighted {background-color: var(--shiki-dark-highlighted-bg) !important;}.shiki.has-highlighted .line.highlighted.warning {background-color: var(--shiki-dark-highlighted-warning-bg) !important;}.shiki.has-highlighted .line.highlighted.error {background-color: var(--shiki-dark-highlighted-error-bg) !important;}.shiki.has-focused .line:not(.focused) {filter: blur(.095rem);opacity: .7;transition: filter .35s,opacity .35s;}.shiki.has-focused:hover .line:not(.focused) {filter: blur(0);opacity: 1;}.shiki.has-diff .line.diff.add {background-color: var(--shiki-dark-diff-add-bg) !important;}.shiki.has-diff .line.diff.remove {background-color: var(--shiki-dark-diff-remove-bg) !important;}";
  assertEquals(
    createStyles("dark", theme, { useColorScheme: false }).replaceAll("\n", ""),
    expected,
  );
});

Deno.test("cssVariablePrefix", { permissions: { env: true } }, async () => {
  const theme = await getTheme();
  const expected =
    "@media (prefers-color-scheme: dark) {.shiki {--theme-dark-highlighted-bg: rgba(101, 117, 133, .16);--theme-dark-highlighted-error-bg: rgba(244, 63, 94, .16);--theme-dark-highlighted-warning-bg: rgba(234, 179, 8, .16);--theme-dark-diff-add-bg: rgba(16, 185, 129, .16);--theme-dark-diff-remove-bg: rgba(244, 63, 94, .16);}.shiki span {color: var(--theme-dark) !important;background-color: var(--theme-dark-bg) !important;}.shiki.has-highlighted .line.highlighted {background-color: var(--theme-dark-highlighted-bg) !important;}.shiki.has-highlighted .line.highlighted.warning {background-color: var(--theme-dark-highlighted-warning-bg) !important;}.shiki.has-highlighted .line.highlighted.error {background-color: var(--theme-dark-highlighted-error-bg) !important;}.shiki.has-focused .line:not(.focused) {filter: blur(.095rem);opacity: .7;transition: filter .35s,opacity .35s;}.shiki.has-focused:hover .line:not(.focused) {filter: blur(0);opacity: 1;}.shiki.has-diff .line.diff.add {background-color: var(--theme-dark-diff-add-bg) !important;}.shiki.has-diff .line.diff.remove {background-color: var(--theme-dark-diff-remove-bg) !important;}}";
  assertEquals(
    createStyles("dark", theme, { cssVariablePrefix: "--theme-" }).replaceAll(
      "\n",
      "",
    ),
    expected,
  );
});
