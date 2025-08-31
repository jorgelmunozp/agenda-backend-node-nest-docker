"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbCluster = process.env.DB_CLUSTER;
const dbDomain = process.env.DB_DOMAIN;
if (!dbUser || !dbPassword || !dbCluster || !dbDomain) {
    throw new Error("❌ Faltan variables de entorno para la conexión a MongoDB");
}
const dbUrl = `mongodb+srv://${dbUser}:${dbPassword}@${dbDomain}/?retryWrites=true&w=majority&appName=${dbCluster}`;
const client = new mongodb_1.MongoClient(dbUrl, {
    serverApi: { version: mongodb_1.ServerApiVersion.v1, strict: true, deprecationErrors: true },
});
let db = null;
async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db("users");
        console.log("✅ Conectado a MongoDB Atlas");
    }
    return db;
}
//# sourceMappingURL=connectDB.js.map