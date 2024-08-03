import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './responses/auth.responce';
import { UserLoginInput } from './inputs/login-user.input';
import { ConfirmEmailInput } from './inputs/confirm-email.input';
import { PasswordResetInput } from './inputs/password-reset.input';
import { UserRegistrationInput } from './inputs/register-user.input';
import { RequestPasswordResetInput } from './inputs/request-password-reset.input';
import { RequestConfirmEmailInput } from './inputs/request-email-confirm.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  login(
    @Args('userLoginInput') userLoginInput: UserLoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(userLoginInput);
  }

  @Mutation(() => Boolean)
  signup(
    @Args('userRegistrationInput') userRegistrationInput: UserRegistrationInput,
  ): Promise<boolean> {
    return this.authService.signup(userRegistrationInput);
  }

  @Mutation(() => AuthResponse)
  refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshToken);
  }

  @Mutation(() => Boolean)
  requestConfirmEmail(
    @Args('requestConfirmEmailInput')
    requestConfirmEmailInput: RequestConfirmEmailInput,
  ) {
    return this.authService.requestConfirmEmail(requestConfirmEmailInput);
  }

  @Mutation(() => AuthResponse)
  confirmEmail(
    @Args('confirmEmailInput') confirmEmailInput: ConfirmEmailInput,
  ): Promise<AuthResponse> {
    return this.authService.confirmEmail(confirmEmailInput);
  }

  @Mutation(() => Boolean)
  requestPasswordReset(
    @Args('requestPasswordResetInput')
    requestPasswordResetInput: RequestPasswordResetInput,
  ): Promise<boolean> {
    return this.authService.requestPasswordReset(requestPasswordResetInput);
  }

  @Mutation(() => Boolean)
  passwordReset(
    @Args('passwordResetInput') passwordResetInput: PasswordResetInput,
  ): Promise<boolean> {
    return this.authService.passwordReset(passwordResetInput);
  }
}
