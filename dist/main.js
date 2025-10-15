"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./src/common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./src/common/interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    await app.listen(3000);
    console.log(`🚀 Server running on ${process.env.FRONTEND_URL}`);
}
bootstrap();
//# sourceMappingURL=main.js.map