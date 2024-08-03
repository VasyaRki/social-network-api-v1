import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { FollowModule } from '../../follow/follow.module';
import { CheckAccessService } from './check-access.service';
import { BlockingModule } from '../../blocking/blocking.module';

@Module({
  imports: [BlockingModule, UserModule, forwardRef(() => FollowModule)],
  providers: [CheckAccessService],
  exports: [CheckAccessService],
})
export class CheckAccessModule {}
