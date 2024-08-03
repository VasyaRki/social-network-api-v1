import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlockedUser } from './blocking.entity';
import { BlockingService } from './blocking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJwtPayload } from '../jwt/interfaces/jwt-payload.interface';
import { IJwtPayloadDecorator } from '../jwt/decorators/jwt-payload.decorator';

@Resolver()
export class BlockingResolver {
  constructor(private readonly blockingService: BlockingService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async block(
    @Args('id') id: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<boolean> {
    return this.blockingService.blockUser({
      blockedUserId: id,
      blockingUserId: jwtPayload.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async unblock(
    @Args('id') id: number,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ) {
    return this.blockingService.unblockUser({
      blockedUserId: id,
      blockingUserId: jwtPayload.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [BlockedUser])
  public async getBlockedUsers(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<BlockedUser[]> {
    return this.blockingService.getMany({ blockingUserId: jwtPayload.id }, [
      'blockedUser',
    ]);
  }
}
