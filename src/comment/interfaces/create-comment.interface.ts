export interface ICreateComment {
  readonly text: string;

  readonly postId: number;

  readonly authorId: number;
}
