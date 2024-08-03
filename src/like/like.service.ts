import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { PostService } from '../post/post.service';
import { EntityType } from './enums/entity-type.enum';
import { EntityService } from '../common/entity.service';
import { CommentService } from '../comment/comment.service';
import { DeleteOrAddLike } from './responses/delete-or-add-like.response';
import { CheckAccessService } from '../common/check-access/check-access.service';

@Injectable()
export class LikeService extends EntityService<Like> {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private postService: PostService,
    private commentService: CommentService,
    private checkAccessService: CheckAccessService,
  ) {
    super(likeRepository);
  }

  async handleLike(authorId, entityId, entityType): Promise<DeleteOrAddLike> {
    const entityService = await this.getEntityService(entityType);

    const entity = await entityService.getOne({ id: entityId });

    const checkAccess = await this.checkAccessService.checkAccess({
      requestingUserId: authorId,
      targetUserId: entity.authorId,
    });

    if (!checkAccess) {
      throw new Error('FORBIDDEN');
    }

    const isLiked = await this.getOne({
      authorId,
      [entityType]: entityId,
    });

    if (isLiked) {
      const removed = await this.delete(isLiked.id);
      return { removed };
    }

    const like = await this.create({
      authorId,
      [entityType]: entityId,
    });

    return { added: !!like };
  }

  private async getEntityService(
    entityType: EntityType,
  ): Promise<PostService | CommentService> {
    if (entityType == EntityType.post) {
      return this.postService;
    } else {
      return this.commentService;
    }
  }
}
