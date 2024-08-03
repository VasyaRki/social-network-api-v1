import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserError } from './user.errors';
import { EntityService } from '../common/entity.service';
import { FileService } from '../common/file/file.service';
import { UpdateUserInput } from './inputs/update-user.input';
import { IUpdatePasswordByEmail } from './interfaces/update-password-by-email.interface';

export class UserService extends EntityService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private fileService: FileService,
  ) {
    super(userRepository);
  }

  public async update(
    id: number,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.getOne({ id });

    if (!user) {
      throw UserError.UserDoesNotExist();
    }

    let avatarUrl = null;

    if (updateUserInput.avatar) {
      try {
        avatarUrl = await this.fileService.upload(
          updateUserInput.avatar,
          'avatar',
        );

        if (user.avatar) {
          await this.fileService.delete(user.avatar);
        }
      } catch (error) {
        throw UserError.AvatarUploadFailed();
      }
    }

    return this.save({
      id,
      ...updateUserInput,
      avatar: avatarUrl || user.avatar,
    });
  }

  async updatePasswordByEmail(payload: IUpdatePasswordByEmail): Promise<User> {
    const existingUser = await this.getOne({ email: payload.email });

    if (!existingUser) {
      throw UserError.UserDoesNotExist();
    }

    await this.userRepository.save({
      id: existingUser.id,
      password: payload.hashedPassword,
    });

    return existingUser;
  }
}
