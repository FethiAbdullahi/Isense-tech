import { DEFAULT_THEME, siteConfig } from "../../../config/site";

/** Inline blocking script — prevents theme flash before React hydrates. */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(siteConfig.themeStorageKey)};var d=${JSON.stringify(DEFAULT_THEME)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":d;}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(DEFAULT_THEME)});}})();`;
