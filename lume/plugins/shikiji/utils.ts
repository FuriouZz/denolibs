const HTML_REPLACEMENTS: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
};

const HTML_UNESCAPE_REPLACE_RE = /(&(amp|lt|gt|quot);)/g;

export function unescape(content: string) {
  return content.replaceAll(
    HTML_UNESCAPE_REPLACE_RE,
    (ch) => HTML_REPLACEMENTS[ch],
  );
}
