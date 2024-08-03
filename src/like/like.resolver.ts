import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { LikeInput } from './inputs/handle-like.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJwtPayload } from '../jwt/interfaces/jwt-payload.interface';
import { DeleteOrAddLike } from './responses/delete-or-add-like.response';
import { IJwtPayloadDecorator } from '../jwt/decorators/jwt-payload.decorator';

@Resolver()
export class LikeResolver {
  constructor(private likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DeleteOrAddLike)
  public async handleLike(
    @Args('likeInput') likeInput: LikeInput,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<DeleteOrAddLike> {
    return this.likeService.handleLike(
      jwtPayload.id,
      likeInput.entityId,
      likeInput.type,
    );
  }
}
