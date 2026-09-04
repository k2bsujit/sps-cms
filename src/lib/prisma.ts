import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function ensureDatabaseUrl(): string {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    return process.env.DATABASE_URL.trim();
  }

  // Running on Vercel or AWS Lambda or Production Serverless
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NODE_ENV === "production") {
    const tmpDbPath = path.join("/tmp", "sps_surya.db");
    
    // Copy starter.db if /tmp/sps_surya.db does not exist yet
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), "prisma", "starter.db"),
        path.join(process.cwd(), "prisma", "dev.db"),
        path.join(__dirname, "..", "..", "prisma", "starter.db"),
        path.join(__dirname, "..", "..", "prisma", "dev.db"),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          } catch (err) {
            console.error("Failed copying starter DB candidate:", candidate, err);
          }
        }
      }
    }

    const resolvedUrl = `file:${tmpDbPath}`;
    process.env.DATABASE_URL = resolvedUrl;
    return resolvedUrl;
  }

  // Local development
  const localDb = path.join(process.cwd(), "prisma", "dev.db");
  const localUrl = `file:${localDb}`;
  process.env.DATABASE_URL = localUrl;
  return localUrl;
}

const activeDbUrl = ensureDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: activeDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
