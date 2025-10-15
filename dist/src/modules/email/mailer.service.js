"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const mailersend_1 = require("mailersend");
let MailerService = class MailerService {
    constructor() {
        this.mailersend = new mailersend_1.MailerSend({
            apiKey: process.env.MAILERSEND_API_KEY || '',
        });
    }
    async sendMail(to, subject, text, html) {
        const sentFrom = new mailersend_1.Sender(process.env.MAILERSEND_SENDER || '', 'OrganizeU');
        const recipients = [new mailersend_1.Recipient(to, to)];
        const emailParams = new mailersend_1.EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setText(text)
            .setHtml(html);
        try {
            const response = await this.mailersend.email.send(emailParams);
            console.log('✅ Email enviado:', response);
            return response;
        }
        catch (error) {
            console.error('❌ Error enviando email:', error);
            throw error;
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailerService);
//# sourceMappingURL=mailer.service.js.map