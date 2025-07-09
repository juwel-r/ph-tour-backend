import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  DB_URL_LOCAL: string;
  //   NODE_ENV: string;
  NODE_ENV: "development" | "production";
}

// export const envVar: EnvConfig = {
//   PORT: process.env.PORT as string,
//   DB_URL: process.env.DB_URL as string,
//   DB_URL_LOCAL: process.env.DB_URL_LOCAL as string,
//   NODE_ENV: process.env.NODE_ENV as string,
// };

// another way --> this will throw error if any variable missing.

const loadEnvVar = (): EnvConfig => {
  const requiredVar: string[] = ["PORT", "DB_URL", "DB_URL_LOCAL", "NODE_ENV"];
  requiredVar.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`${key} environment variable missing!`);
    }
  });
  
  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    DB_URL: process.env.DB_URL!,
    DB_URL_LOCAL: process.env.DB_URL_LOCAL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVar = loadEnvVar();
