import React, { JSX } from "react";

export type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const defaultProps: Required<IconProps> = {
  size: 24,
  className: "",
  strokeWidth: 2,
};

function svg(
  paths: string,
  { size, className, strokeWidth }: Required<IconProps>
): JSX.Element {
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    dangerouslySetInnerHTML: { __html: paths },
  });
}

export const Icons = {
  logo: (p: IconProps = {}) =>
    svg(
      '<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
      { ...defaultProps, ...p }
    ),

  dashboard: (p: IconProps = {}) =>
    svg(
      '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
      { ...defaultProps, ...p }
    ),

  workspace: (p: IconProps = {}) =>
    svg(
      '<path d="M2 20V4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2z"/><path d="M9 2v20"/><path d="M14 2v20"/>',
      { ...defaultProps, ...p }
    ),

  document: (p: IconProps = {}) =>
    svg(
      '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
      { ...defaultProps, ...p }
    ),

  favourite: (p: IconProps = {}) =>
    svg(
      '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
      { ...defaultProps, ...p }
    ),

  recent: (p: IconProps = {}) =>
    svg(
      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      { ...defaultProps, ...p }
    ),

  settings: (p: IconProps = {}) =>
    svg(
      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z"/>',
      { ...defaultProps, ...p }
    ),

  search: (p: IconProps = {}) =>
    svg(
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
      { ...defaultProps, ...p }
    ),

  plus: (p: IconProps = {}) =>
    svg(
      '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      { ...defaultProps, ...p }
    ),

  trash: (p: IconProps = {}) =>
    svg(
      '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
      { ...defaultProps, ...p }
    ),

  edit: (p: IconProps = {}) =>
    svg(
      '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      { ...defaultProps, ...p }
    ),

  logout: (p: IconProps = {}) =>
    svg(
      '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
      { ...defaultProps, ...p }
    ),

  user: (p: IconProps = {}) =>
    svg(
      '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      { ...defaultProps, ...p }
    ),

  chevronRight: (p: IconProps = {}) =>
    svg('<polyline points="9 18 15 12 9 6"/>', { ...defaultProps, ...p }),

  chevronDown: (p: IconProps = {}) =>
    svg('<polyline points="6 9 12 15 18 9"/>', { ...defaultProps, ...p }),

  close: (p: IconProps = {}) =>
    svg(
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      { ...defaultProps, ...p }
    ),

  folder: (p: IconProps = {}) =>
    svg(
      '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>',
      { ...defaultProps, ...p }
    ),

  home: (p: IconProps = {}) =>
    svg(
      '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
      { ...defaultProps, ...p }
    ),

  menu: (p: IconProps = {}) =>
    svg(
      '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
      { ...defaultProps, ...p }
    ),

  bell: (p: IconProps = {}) =>
    svg(
      '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
      { ...defaultProps, ...p }
    ),
};
