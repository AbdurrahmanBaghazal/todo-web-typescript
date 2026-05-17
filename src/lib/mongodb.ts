import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured");
}

const mongoUri = MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? {
  conn: null,
  promise: null
};

global.mongooseCache = cached;

export async function connectMongoDB() {
  if (cached.conn) {
    return cached.conn;
  }

  cached.promise ??= mongoose.connect(mongoUri, {
    bufferCommands: false,
    dbName: "todo-web-typescript"
  });

  cached.conn = await cached.promise;
  return cached.conn;
}
