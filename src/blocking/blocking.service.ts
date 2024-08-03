import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedUser } from './blocking.entity';
import { EntityService } from '../common/entity.service';
import { IBlockUser } from './interfaces/block-user.interface';
import { IIsBlocked } from './interfaces/is-blocked.interface';
import { IUnblockUser } from './interfaces/unblock-user.interface';

@Injectable()
export class BlockingService extends EntityService<BlockedUser> {
  constructor(
    @InjectRepository(BlockedUser)
    private blockedUserRepository: Repository<BlockedUser>,
  ) {
    super(blockedUserRepository);
  }

  public async blockUser(payload: IBlockUser): Promise<boolean> {
    const blockUser = await this.create({
      blockingUserId: payload.blockingUserId,
      blockedUserId: payload.blockedUserId,
    });

    return !!blockUser;
  }

  public async unblockUser(payload: IUnblockUser): Promise<boolean> {
    const blockUser = await this.getOne({
      blockedUserId: payload.blockedUserId,
      blockingUserId: payload.blockingUserId,
    });

    const result = await this.delete(blockUser?.id);

    return !!result;
  }

  public async isBlocked(payload: IIsBlocked): Promise<boolean> {
    const blockedUser = await this.getOne(payload);

    return !!blockedUser;
  }
}
