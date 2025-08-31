import { MongoClient, ServerApiVersion, Db } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

const dbUser: string | undefined = process.env.DB_USER;
const dbPassword: string | undefined = process.env.DB_PASSWORD;
const dbCluster: string | undefined = process.env.DB_CLUSTER;
const dbDomain: string | undefined = process.env.DB_DOMAIN;

if (!dbUser || !dbPassword || !dbCluster || !dbDomain) {
  throw new Error("❌ Faltan variables de entorno para la conexión a MongoDB");
}

const dbUrl = `mongodb+srv://${dbUser}:${dbPassword}@${dbDomain}/?retryWrites=true&w=majority&appName=${dbCluster}`;

const client = new MongoClient(dbUrl, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db("users");
    console.log("✅ Conectado a MongoDB Atlas");
  }
  return db;
}
