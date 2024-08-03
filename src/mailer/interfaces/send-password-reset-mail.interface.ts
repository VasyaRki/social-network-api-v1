export interface ISendPasswordResetMail {
  readonly to: string;

  readonly username: string;

  readonly confirmationHash: string;
}
