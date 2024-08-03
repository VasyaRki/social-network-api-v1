import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserService } from './user.service';
import { GetUsersInput } from './inputs/get-users.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJwtPayload } from '../jwt/interfaces/jwt-payload.interface';
import { PaginatedUsersResponce } from './responses/paginated-users.response';
import { IJwtPayloadDecorator } from '../jwt/decorators/jwt-payload.decorator';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => PaginatedUsersResponce)
  public async getUsersByFilter(
    @Args('getUsersInput', { nullable: true }) getUsersInput: GetUsersInput,
  ): Promise<PaginatedUsersResponce> {
    return this.userService.paginate(
      getUsersInput?.paginationQuery,
      getUsersInput?.filter,
    );
  }

  @Query(() => User)
  public async getUserById(@Args('id') id: number): Promise<User> {
    return this.userService.getOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  public async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<User> {
    return this.userService.update(jwtPayload.id, updateUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  public async deleteUser(
    @IJwtPayloadDecorator() jwtPayload: IJwtPayload,
  ): Promise<boolean> {
    return this.userService.delete(jwtPayload.id);
  }
}
