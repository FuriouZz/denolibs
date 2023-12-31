import { OnCreateStyleHook } from "../types.ts";

export {
  transformerNotationFocus,
  type TransformerNotationFocusOptions,
} from "../deps.ts";

export const cssRulesFocus: OnCreateStyleHook = () => {
  return `
.shiki.has-focused .line.focused {
  display: inline-block;
  width: 100%;
  margin: 0 -24px;
  padding: 0 24px;
  transition: background-color .5s;
}
.shiki.has-focused .line:not(.focused) {
  filter: blur(0.095rem);
  opacity: 0.7;
  transition: filter 0.35s, opacity 0.35s;
}
.shiki.has-focused:hover .line:not(.focused) {
  filter: blur(0);
  opacity: 1;
}`;
}
