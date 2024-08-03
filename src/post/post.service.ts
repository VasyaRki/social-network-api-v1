import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostError } from './post.errors';
import { TagService } from '../tag/tag.service';
import { Follow } from '../follow/follow.entity';
import { EntityService } from '../common/entity.service';
import { FollowService } from '../follow/follow.service';
import { FileService } from '../common/file/file.service';
import { CreatePostInput } from './inputs/create-post.input';
import { BlockingService } from '../blocking/blocking.service';
import { IGetPostById } from './interface/get-post-by-id.interface';
import { PaginationQuery } from '../common/types/pagination-query.type';
import { GetPostsByFilterInput } from './inputs/get-posts-by-filter.input';
import { PaginatedPostsResponce } from './responses/paginated-posts.response';
import { CheckAccessService } from '../common/check-access/check-access.service';

@Injectable()
export class PostService extends EntityService<Post> {
  constructor(
    private tagService: TagService,
    private fileService: FileService,
    private followService: FollowService,
    private blockingService: BlockingService,
    private checkAccessService: CheckAccessService,
    @InjectRepository(Post) private service: Repository<Post>,
  ) {
    super(service);
  }

  public async deletePost(postId: number, userId: number): Promise<boolean> {
    const post = await super.getOne({ id: postId });
    if (post.authorId !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return super.delete(postId);
  }

  public async getPostById(payload: IGetPostById): Promise<Post> {
    const post = await this.getOne({ id: payload.postId }, [
      'like',
      'author',
      'comment',
    ]);

    const isOwner = payload.userId === post.authorId;

    const checkAccess = await this.checkAccessService.checkAccess({
      requestingUserId: payload.userId,
      targetUserId: post.authorId,
    });

    if (!isOwner && !checkAccess) {
      throw new Error('FORBIDDEN');
    }

    return post;
  }

  public async getFeedPosts(
    authorId: number,
    paginationQuery?: PaginationQuery,
  ): Promise<Post[]> {
    const page = paginationQuery?.page || 1;
    const limit = paginationQuery?.limit || 20;

    const feedPosts = await this.service
      .createQueryBuilder('post')
      .innerJoinAndSelect(
        Follow,
        'follow',
        'post.userId = follow.userId AND follow.authorId = :authorId AND follow.isConfirmed = true',
        { authorId },
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return feedPosts;
  }

  public async getPostsByFilter(
    payload: GetPostsByFilterInput,
  ): Promise<PaginatedPostsResponce> {
    return this.paginate(
      payload?.paginationQuery,
      { ...payload?.filter, author: { isAccountPrivate: false } },
      ['comment', 'author', 'like', 'tags'],
    );
  }

  public async createPost(
    authorId: number,
    createPostInput: CreatePostInput,
  ): Promise<Post> {
    const tags = [];

    let photo = null;

    if (createPostInput.photo) {
      try {
        photo = await this.fileService.upload(createPostInput.photo, 'posts');
      } catch (error) {
        throw PostError.PhotoUploadFailed();
      }
    }

    if (createPostInput.tags) {
      for (const name of createPostInput.tags) {
        let tag = await this.tagService.getOne({ name });
        if (!tag) {
          tag = await this.tagService.create({ name });
        }
        tags.push(tag);
      }
    }

    const post = await this.create({
      tags,
      photo,
      authorId: authorId,
      title: createPostInput.title,
      content: createPostInput.content,
    });

    return post;
  }
}
