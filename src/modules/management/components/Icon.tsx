import type { CSSProperties } from "react";

const paths = {
  panel: "M9 3v18M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 5h1m-1 4h1m-1 4h1",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  wallet: "M3 7h18M3 11h18M6 17h4M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z",
  flag: "M5 21V3m0 0c5-4 9 4 15 0v11c-6 4-10-4-15 0",
  video: "m10 8 6 4-6 4ZM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z",
  message: "M8 8h8M8 12h5M4 3h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H9l-5 4v-4H3V4a1 1 0 0 1 1-1Z",
  settings: "m9 3 1-2h4l1 2 3 2 2 1 2 4-2 2v3l1 2-3 3-3-1-3 1-2 1-4-2v-3l-2-2 1-4 3-1Zm6 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 13h4",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  back: "M20 12H4m6-6-6 6 6 6",
  chevron: "m9 5 7 7-7 7",
  down: "m5 9 7 7 7-7",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 4v16M4 12h16",
  clock: "M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  book: "M12 5v17M2 3c5-1 7 0 10 2 3-2 5-3 10-2v16c-5-1-7 0-10 2-3-2-5-3-10-2Z",
  lock: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v12H5Zm7 5v3",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  send: "m22 2-7 20-4-9-9-4Zm0 0L11 13",
  more: "M4 12h.01M12 12h.01M20 12h.01",
  edit: "m16 3 5 5-12 12H4v-5Zm-2 2 5 5",
  file: "M14 2H4v20h16V8Zm0 0v6h6M8 13h8M8 17h6",
  logout: "M9 4H3v16h6m5-13 5 5-5 5m-7-5h16",
  info: "M12 11v6m0-10h.01m9 5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  filter: "M3 5h18l-7 8v7l-4-2v-5Z",
  download: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4",
} as const;
export type IconName = keyof typeof paths;
export function Icon({ name, size = 20, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <svg data-icon={name} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{name === "more" ? <><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="20" cy="12" r="1.5" fill="currentColor" stroke="none" /></> : <path d={paths[name]} />}</svg>;
}
