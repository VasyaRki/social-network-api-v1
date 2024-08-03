export interface ICheckAccess {
  readonly requestingUserId: number;

  readonly targetUserId: number;
}
