export interface IUpdatePasswordByEmail {
  readonly email: string;

  readonly hashedPassword: string;
}
