declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
      ADMIN_PASSWORD: string;
      RADIO_STREAM_URL?: string;
      RSS_FEED_URL?: string;
    }
  }

  interface Window {
    mongooseCache?: {
      conn: any;
      promise: Promise<any> | null;
    };
  }
}

export {};