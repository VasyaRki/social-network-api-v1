export interface ISendAccountConfirmationMail {
  readonly to: string;

  readonly username: string;

  readonly confirmationHash: string;
}
