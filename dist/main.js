"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const connectDB_1 = require("./src/config/connectDB");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3000);
    const db = await (0, connectDB_1.connectDB)();
    console.log(`🚀 Server running on http://localhost:3000`);
    console.log(`✅ Database connected: ${db.databaseName}`);
    console.log(`✅ Database: ${db.collections}`);
}
bootstrap();
//# sourceMappingURL=main.js.map