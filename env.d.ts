declare namespace NodeJS {
  interface AppEnv {
    PORT: number;
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    NODE_ENV: 'development' | 'production' | 'test';
  }

  interface ProcessEnv extends AppEnv {}
}
