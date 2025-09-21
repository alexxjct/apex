import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: Cached = {
  conn: null,
  promise: null,
};

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // opciones recomendadas
      bufferCommands: false,
      // otras opciones si deseas
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => mongooseInstance);
  }
  cached.conn = await cached.promise;

  // Evitar usar 'any', tipar global
  if (typeof global !== "undefined") {
    (global as unknown as { __mongoose?: Cached }).__mongoose = cached;
  }

  return cached.conn;
}
