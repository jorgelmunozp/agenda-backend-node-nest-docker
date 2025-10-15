export declare class MailerService {
    private mailersend;
    constructor();
    sendMail(to: string, subject: string, text: string, html: string): Promise<import("mailersend/lib/services/request.service").APIResponse>;
}
