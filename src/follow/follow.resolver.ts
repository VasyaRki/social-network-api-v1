import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJwtPayload } from '../jwt/interfaces/jwt-payload.interface';
import { IJwtPayloadDecorator } from '../jwt/decorators/jwt-payload.decorator';

@Resolver()
export class FollowResolver {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async follow(
    @Args('userId') userId: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<boolean> {
    return this.followService.follow({ authorId: jwtPayload.id, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async unfollow(
    @Args('userId') userId: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ) {
    return this.followService.unfollow({ authorId: jwtPayload.id, userId });
  }

  @Query(() => [Follow])
  public async getFollowerByUserId(
    @Args('userId') userId: number,
  ): Promise<Follow[]> {
    return this.followService.getMany({ userId, isConfirmed: true }, [
      'author',
    ]);
  }

  @Query(() => [Follow])
  public async getFollowingByUserId(
    @Args('userId') userId: number,
  ): Promise<Follow[]> {
    return this.followService.getMany({ authorId: userId, isConfirmed: true }, [
      'user',
    ]);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Follow])
  public async getPendingSubscriptionRequests(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<Follow[]> {
    return this.followService.getPendingSubscriptionRequests(jwtPayload.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async confirmSubscriptionRequest(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
    @Args('id') id: number,
  ): Promise<boolean> {
    return !!this.followService.confirmSubscriptionRequest({
      authorId: id,
      userId: jwtPayload.id,
    });
  }
}
