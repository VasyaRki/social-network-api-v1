import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserError } from '../../user/user.errors';
import { UserService } from '../../user/user.service';
import { FollowService } from '../../follow/follow.service';
import { BlockingService } from '../../blocking/blocking.service';
import { ICheckAccess } from './interfaces/check-access.interface';

@Injectable()
export class CheckAccessService {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => FollowService))
    private followService: FollowService,
    private blockingService: BlockingService,
  ) {}

  public async checkAccess(payload: ICheckAccess) {
    const isBlocked = await this.blockingService.isBlocked({
      blockingUserId: payload.targetUserId,
      blockedUserId: payload.requestingUserId,
    });

    if (isBlocked) throw new Error('FORBIDDEN');

    const user = await this.userService.getOne({ id: payload.targetUserId });

    if (!user) {
      throw UserError.UserDoesNotExist();
    }

    if (!user.isAccountPrivate) {
      return true;
    }

    const isFollowing = await this.followService.isFollowing({
      userId: payload.targetUserId,
      authorId: payload.requestingUserId,
    });

    return isFollowing;
  }
}
