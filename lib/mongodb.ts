/**
 * lib/mongodb.ts
 * Singleton Mongoose connection with global cache.
 * Prevents connection pool exhaustion in serverless / hot-reload environments.
 */

import mongoose from "mongoose";

// NOTE: Do NOT read MONGODB_URI at module level — Next.js evaluates modules
// during the build phase where env vars are not yet injected. Read it lazily
// inside connectDB() so it is resolved at request time.

// Extend the NodeJS global type to hold the cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a module-level variable scoped to the Node.js process so Hot Module
// Replacement in dev does not create a new connection on every re-render.
const globalForMongoose = global as typeof global & { mongooseCache?: MongooseCache };

if (!globalForMongoose.mongooseCache) {
  globalForMongoose.mongooseCache = { conn: null, promise: null };
}

const cache = globalForMongoose.mongooseCache;

export async function connectDB(): Promise<typeof mongoose> {
  // Read at request time (not module load time) so Amplify/Lambda env vars are available
  const MONGODB_URI = (process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI) as string;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  // Return cached connection if already established
  if (cache.conn) return cache.conn;

  // Return in-progress promise if connection is being established
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,   // fail fast if Atlas is unreachable
      maxPoolSize: 10,                   // cap concurrent connections
      bufferCommands: false,             // fail immediately instead of buffering
    }).then((m) => {
      console.log("✅ MongoDB connected");
      return m;
    }).catch((err) => {
      cache.promise = null;              // reset so next call can retry
      throw err;
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export default connectDB;
