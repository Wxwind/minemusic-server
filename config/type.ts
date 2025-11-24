export interface EnvironmentVariables {
  PORT: number;

  ALLOWED_ORIGINS: string; // ,分隔

  DB_HOST: string;
  DB_PORT: number;
  DB_DATABASE: string;
  DB_USER: string;
  DB_PASSWD: string;
  DB_SYNC: boolean;
}
