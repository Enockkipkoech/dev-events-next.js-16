import mongoose from "mongoose";

// Define the structure of our cached connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to include our mongoose cache
// This prevents multiple connections during Next.js hot reloading in development
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}
// Initialize the cached connection object
// In development, use a global variable to preserve the connection across hot reloads
// In production, the cache will be scoped to this module
const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Implements connection caching to prevent multiple connections in development
 * @returns Promise that resolves to the Mongoose instance
 * @throws Error if connection fails
 */
async function connectDB(): Promise<typeof mongoose> {

  // Get MongoDB URI from environment variables
  const MONGODB_URI: string | undefined = process.env.MONGODB_URI;
  // If we already have an active connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a connection promise, create one
  if (!cached.promise) {
    // Validate that the MongoDB URI exists
    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env or .env.local"
      );
    }

    const options = {
      bufferCommands: false, // Disable Mongoose buffering for better error handling
    };

    // Create the connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI!, options)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((error: Error) => {
        // Reset promise on failure to allow retry
        cached.promise = null;
        console.error("❌ MongoDB connection failed:", error.message);
        throw error;
      });
  }

  try {
    // Wait for the connection promise to resolve and cache the connection
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, reset the promise to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// Set up connection event listeners for production monitoring
if (process.env.NODE_ENV === "production") {
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
  });

  mongoose.connection.on("error", (error: Error) => {
    console.error("Mongoose connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
  });
}

export default connectDB;
