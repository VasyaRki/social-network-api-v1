import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { UserService } from '../user/user.service';
import { IFollow } from './interfaces/follow.interface';
import { EntityService } from '../common/entity.service';
import { IUnfollow } from './interfaces/unfollow.interface';
import { IIsFollowing } from './interfaces/is-following.interface';
import { CheckAccessService } from '../common/check-access/check-access.service';
import { IConfirmSubscriptionRequest } from './interfaces/confirm-subscription-request.interface';

export class FollowService extends EntityService<Follow> {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    private userService: UserService,
    private checkAccessService: CheckAccessService,
  ) {
    super(followRepository);
  }

  public async unfollow(unfollowInput: IUnfollow): Promise<boolean> {
    const payload = await this.getOne(unfollowInput);

    return this.delete(payload.id);
  }

  public async follow(payload: IFollow): Promise<boolean> {
    const checkAccess = await this.checkAccessService.checkAccess({
      targetUserId: payload.userId,
      requestingUserId: payload.authorId,
    });

    const follow = await this.create({ ...payload, isConfirmed: checkAccess });

    return !!follow;
  }

  public async isFollowing(payload: IIsFollowing): Promise<boolean> {
    const follow = await this.getOne({ ...payload, isConfirmed: true });

    return !!follow;
  }

  public async getPendingSubscriptionRequests(
    userId: number,
  ): Promise<Follow[]> {
    return this.getMany({ userId, isConfirmed: false });
  }

  public async confirmSubscriptionRequest(
    payload: IConfirmSubscriptionRequest,
  ): Promise<Follow> {
    const follow = await this.getOne(payload);

    return this.save({ ...follow, isConfirmed: true });
  }
}
