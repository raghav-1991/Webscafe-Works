/** Resolve an image that lives in /public/assets/imgs, respecting Vite's base URL. */
export const img = (file) => `${import.meta.env.BASE_URL}assets/imgs/${file}`;
