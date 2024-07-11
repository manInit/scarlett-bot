declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      CLIENT_ID: string;
      NODE_ENV: string;
    }
  }
}

export {};
