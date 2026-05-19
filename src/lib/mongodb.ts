import mongoose from "mongoose";

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
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

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
