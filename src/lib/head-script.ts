export const THEME_STORAGE_KEY = "kiln-theme";
export const BANNER_STORAGE_KEY = "kiln-demo-banner";

/**
 * Runs in <head> before first paint: applies the saved (or system) theme and
 * hides the demo banner if it was dismissed, so neither flashes on load.
 */
export const headScript = `(function(){try{var d=document.documentElement,s=localStorage,p=s.getItem("${THEME_STORAGE_KEY}")||"system",t=p==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):p;d.setAttribute("data-theme",t);if(s.getItem("${BANNER_STORAGE_KEY}")==="hidden")d.setAttribute("data-demo-banner","hidden")}catch(e){}})()`;
