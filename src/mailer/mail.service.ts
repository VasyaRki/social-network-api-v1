import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplates } from './enums/email-templates.enum';
import { ISendPasswordResetMail } from './interfaces/send-password-reset-mail.interface';
import { ISendAccountConfirmationMail } from './interfaces/send-account-confirmation-mail.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendAccountConfirmationMail(
    payload: ISendAccountConfirmationMail,
  ): Promise<boolean> {
    const url = new URL(
      `${this.configService.getOrThrow<string>(
        'FRONTEND_BASE_URL',
      )}/auth/account-confirm`,
    );

    url.searchParams.append('confirmationHash', payload.confirmationHash);

    await this.mailerService.sendMail({
      to: payload.to,
      template: EmailTemplates.accountConfirm,
      context: { url, username: payload.username },
    });

    return true;
  }

  public async sendPasswordResetMail(
    payload: ISendPasswordResetMail,
  ): Promise<boolean> {
    const url = new URL(
      `${this.configService.getOrThrow<string>(
        'FRONTEND_BASE_URL',
      )}/auth/reset-password`,
    );

    url.searchParams.append('confirmationHash', payload.confirmationHash);

    const sent = await this.mailerService.sendMail({
      to: payload.to,
      template: EmailTemplates.passwordReset,
      context: { url, username: payload.username },
    });

    return sent;
  }
}
