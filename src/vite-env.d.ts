/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MAILCHIMP_URL: string;
  readonly VITE_GA_TRACKING_CODE: string;
  readonly VITE_MAPBOX_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@ra/*';
