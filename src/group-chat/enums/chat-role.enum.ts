import { registerEnumType } from '@nestjs/graphql';

export enum ChatRoleEnum {
  USER = 'USER',
  OWNER = 'OWNER',
  MODERATOR = 'MODERATOR',
}

registerEnumType(ChatRoleEnum, {
  name: 'ChatRoleEnum',
});
