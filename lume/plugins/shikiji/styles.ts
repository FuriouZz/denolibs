import { dark, light } from "./colors.ts";
import { GetStylesOptions } from "./createStyles.ts";

const bg = (
  { cssVariablePrefix, theme, useDefaultTheme, transformer, modifier, extra="" }:
    & GetStylesOptions
    & {
      transformer: string;
      modifier?: string;
      extra?: string;
    },
) => {
  const important = useDefaultTheme ? " !important" : "";
  let selector = `.shiki.has-${transformer} .line.${transformer}`;
  selector = modifier ? `${selector}.${modifier}` : selector;
  const variable = modifier ? `-${modifier}` : "";
  return `${selector} {\nbackground-color: var(${cssVariablePrefix}${theme}-${transformer}${variable}-bg)${important};${extra}\n}`;
};

export const variables = (
  { cssVariablePrefix, theme }: GetStylesOptions,
) => {
  const colors = theme.includes("dark") ? dark : light;
  return [
    [
      `.shiki {\n`,
      Object.entries(colors).map(([key, value]) => {
        return `${cssVariablePrefix}${theme}-${key}: ${value}`;
      }).join(";\n"),
      `;\n}`,
    ].join(""),
  ];
};

export const token = (
  { cssVariablePrefix, theme, useDefaultTheme }: GetStylesOptions,
) => {
  const important = useDefaultTheme ? " !important" : "";
  return [
    [
      `.shiki {\n`,
      `background-color: var(${cssVariablePrefix}${theme}-bg)${important};\n`,
      `}`,
      `.shiki span {\n`,
      `color: var(${cssVariablePrefix}${theme})${important};\n`,
      `background-color: var(${cssVariablePrefix}${theme}-bg)${important};\n`,
      `}`,
    ].join(""),
  ];
};

export const highlighted = (options: GetStylesOptions) => {
  const extra = [
    "transition: background-color .5s",
    "margin: 0 -24px",
    "padding: 0 24px",
    "width: calc(100% + 48px)",
    "display: inline-block",
  ].join(";\n");

  return [
    bg({ transformer: "highlighted", extra, ...options }),
    bg({ transformer: "highlighted", modifier: "warning", ...options }),
    bg({ transformer: "highlighted", modifier: "error", ...options }),
  ];
};

export const diff = (options: GetStylesOptions) => {
  return [
    bg({ transformer: "diff", modifier: "add", ...options }),
    bg({ transformer: "diff", modifier: "remove", ...options }),
  ];
};

export const focused = (
  _options: GetStylesOptions,
) => {
  return [
    [
      `.shiki.has-focused .line:not(.focused) {\n`,
      `filter: blur(.095rem);\n`,
      `opacity: .7;\n`,
      `transition: filter .35s,opacity .35s;\n`,
      `}`,
    ].join(""),
    [
      `.shiki.has-focused:hover .line:not(.focused) {\n`,
      `filter: blur(0);\n`,
      `opacity: 1;\n`,
      `}`,
    ].join(""),
  ];
};
