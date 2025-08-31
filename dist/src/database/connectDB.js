"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongodb_1 = require("mongodb");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
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