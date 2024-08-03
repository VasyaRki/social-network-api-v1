import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { PostError } from '../post/post.errors';
import { PostService } from '../post/post.service';
import { EntityService } from '../common/entity.service';
import { IDeleteComment } from './interfaces/delete-comment.interface';
import { ICreateComment } from './interfaces/create-comment.interface';
import { CheckAccessService } from '../common/check-access/check-access.service';

@Injectable()
export class CommentService extends EntityService<Comment> {
  constructor(
    private postService: PostService,
    private checkAccessService: CheckAccessService,
    @InjectRepository(Comment) private service: Repository<Comment>,
  ) {
    super(service);
  }

  public async deleteComment(
    deleteCommentInput: IDeleteComment,
  ): Promise<boolean> {
    const { commentId } = deleteCommentInput;
    const { authorId } = deleteCommentInput;
    const comment = await super.getOne({ id: commentId });

    if (comment.authorId !== authorId) {
      return false;
    }

    return super.delete(commentId);
  }

  public async createComment(comment: ICreateComment): Promise<Comment> {
    const post = await this.postService.getOne({ id: comment.postId });

    if (!post) {
      throw PostError.PostNotFound();
    }

    const postOwner = post.authorId;

    const checkAccess = await this.checkAccessService.checkAccess({
      targetUserId: postOwner,
      requestingUserId: comment.authorId,
    });

    const isOwner = postOwner === comment.authorId;

    if (!checkAccess && !isOwner) {
      throw new Error('FORBIDDEN');
    }

    return this.create(comment);
  }
}
