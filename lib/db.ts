import mongoose from "mongoose";
import dns from "dns";

/** Cached connection for Next.js hot-reloading */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  // Override system DNS with Google's public DNS.
  // Fixes querySrv ECONNREFUSED caused by Windows c-ares failing to
  // query link-local IPv6 DNS servers (fe80::1 on many home routers).
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

