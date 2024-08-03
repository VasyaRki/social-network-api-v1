import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';
import { AuthError } from './errors/auth.error';
import { AUTH_CONSTANTS } from './auth.constants';
import { UserService } from '../user/user.service';
import { JWT_CONSTANTS } from '../jwt/jwt.constants';
import { MailService } from '../mailer/mail.service';
import { JwtTypes } from '../jwt/enums/jwt-types.enum';
import { Provider } from '../user/enums/provider.enum';
import { AuthResponse } from './responses/auth.responce';
import { CACHE_CONSTANTS } from '../cache/cache.constants';
import { GoogleAuthInput } from './inputs/google-auth.input';
import { ILoginUser } from './interfaces/login-user.interface';
import { ConfirmEmailInput } from './inputs/confirm-email.input';
import { PasswordResetInput } from './inputs/password-reset.input';
import { IRegisterUser } from './interfaces/register-user.interface';
import { JwtService } from '../jwt/interfaces/jwt-service.interface';
import { IJwtPayload } from '../jwt/interfaces/jwt-payload.interface';
import { ICacheService } from '../cache/interfaces/cache-service.interface';
import { RequestConfirmEmailInput } from './inputs/request-email-confirm.input';
import { RequestPasswordResetInput } from './inputs/request-password-reset.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    @Inject(CACHE_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly cacheService: ICacheService,
  ) {}

  public async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.getOne({ email: username });

    if (!user) {
      throw AuthError.DoesNotExists();
    }

    if (!user.isEmailConfirmed) {
      throw AuthError.EmailNotConfirmed();
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw AuthError.PasswordsNotMatching();
    }

    return user;
  }

  public async login(userLoginInput: ILoginUser): Promise<AuthResponse> {
    const { email, password } = userLoginInput;
    const user = await this.validateUser(email, password);

    const jwtPair = this.jwtService.generatePair({ id: user.id });

    this.userService.save({
      id: user.id,
      refreshToken: jwtPair.refreshToken,
    });

    return {
      ...jwtPair,
      user,
    };
  }

  public async signup(userRegisterInput: IRegisterUser): Promise<boolean> {
    const candidate = await this.userService.getOne({
      email: userRegisterInput.email,
    });

    if (candidate) {
      throw AuthError.AlreadyExists();
    }

    const hashedPassword = await bcrypt.hash(userRegisterInput.password, 10);

    const user = await this.userService.create({
      ...userRegisterInput,
      password: hashedPassword,
    });

    return this.requestConfirmEmail({ email: user.email });
  }

  public async requestConfirmEmail(
    requestConfirmEmailInput: RequestConfirmEmailInput,
  ): Promise<boolean> {
    const user = await this.userService.getOne({
      email: requestConfirmEmailInput.email,
    });

    if (!user) {
      throw AuthError.DoesNotExists();
    }

    if (user.isEmailConfirmed) {
      throw AuthError.EmailAlreadyConfirmed();
    }

    const emailConfirmationCounterKey =
      AUTH_CONSTANTS.SIGN_UP.EMAIL_CONFIRMATION.PREFIX + user.email;

    const emailConfirmationRequests = await this.cacheService.get<number>(
      emailConfirmationCounterKey,
    );

    const maxRequests = AUTH_CONSTANTS.SIGN_UP.EMAIL_CONFIRMATION.MAX_REQUESTS;

    if (emailConfirmationRequests && emailConfirmationRequests >= maxRequests) {
      throw AuthError.MaxEmailConfirmationRequestsReached();
    }

    const confirmationHash = crypto.randomUUID();

    const key = AUTH_CONSTANTS.SIGN_UP.CACHE.PREFIX + confirmationHash;

    await this.cacheService.set(
      key,
      user.email,
      AUTH_CONSTANTS.SIGN_UP.CACHE.TTL,
    );

    await this.cacheService.set(
      emailConfirmationCounterKey,
      emailConfirmationRequests + 1 || 0,
      AUTH_CONSTANTS.SIGN_UP.EMAIL_CONFIRMATION.TTL,
    );

    try {
      return this.mailService.sendAccountConfirmationMail({
        to: user.email,
        confirmationHash,
        username: user.username,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async confirmEmail(
    confirmEmail: ConfirmEmailInput,
  ): Promise<AuthResponse> {
    const key =
      AUTH_CONSTANTS.SIGN_UP.CACHE.PREFIX + confirmEmail.confirmationHash;

    const email = await this.cacheService.get<string>(key);

    if (!email) {
      throw AuthError.InvalidConfirmationCode();
    }

    const user = await this.userService.getOne({ email });

    if (user.isEmailConfirmed) {
      throw AuthError.EmailAlreadyConfirmed();
    }

    const jwtPair = this.jwtService.generatePair({ id: user.id });

    try {
      await this.userService.save({
        id: user.id,
        isEmailConfirmed: true,
        refreshToken: jwtPair.refreshToken,
      });
    } catch (error) {
      throw new Error(error);
    }

    return {
      user,
      ...jwtPair,
    };
  }

  public async requestPasswordReset(
    requestPasswordResetInput: RequestPasswordResetInput,
  ): Promise<boolean> {
    const user = await this.userService.getOne({
      email: requestPasswordResetInput.email,
    });

    if (!user || !user.isEmailConfirmed) {
      throw AuthError.DoesNotExists();
    }

    const maxRequests =
      AUTH_CONSTANTS.PASSWORD_RESET.PASSWORD_RESET_REQUEST.MAX_REQUESTS;

    const passwordResetCounterKey =
      AUTH_CONSTANTS.PASSWORD_RESET.PASSWORD_RESET_REQUEST.PREFIX + user.email;

    const passwordResetRequests = await this.cacheService.get<number>(
      passwordResetCounterKey,
    );

    if (passwordResetRequests && passwordResetRequests > maxRequests) {
      throw AuthError.MaxPasswordResetRequestsReached();
    }

    const confirmationHash = await crypto.randomUUID();

    const key = AUTH_CONSTANTS.PASSWORD_RESET.CACHE.PREFIX + confirmationHash;

    await this.cacheService.set<string>(
      key,
      requestPasswordResetInput.email,
      AUTH_CONSTANTS.PASSWORD_RESET.CACHE.TTL,
    );

    await this.cacheService.set(
      passwordResetCounterKey,
      passwordResetRequests + 1 || 0,
      AUTH_CONSTANTS.PASSWORD_RESET.PASSWORD_RESET_REQUEST.TTL,
    );

    await this.mailService.sendPasswordResetMail({
      confirmationHash,
      username: user.username,
      to: requestPasswordResetInput.email,
    });

    return true;
  }

  public async passwordReset(
    passwordResetInput: PasswordResetInput,
  ): Promise<boolean> {
    const key =
      AUTH_CONSTANTS.PASSWORD_RESET.CACHE.PREFIX +
      passwordResetInput.confirmationHash;

    const email = await this.cacheService.get<string>(key);

    if (!email) {
      throw AuthError.InvalidConfirmationCode();
    }

    const hashedPassword = await bcrypt.hash(passwordResetInput.password, 10);

    try {
      await this.userService.updatePasswordByEmail({
        email,
        hashedPassword,
      });
    } catch (error) {
      throw new Error(error);
    }

    return true;
  }

  public async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const payload: IJwtPayload = this.jwtService.verify(
      refreshToken,
      JwtTypes.Refresh,
    );
    const userId = payload.id;

    const user = await this.userService.getOne({ id: userId });

    if (!user || user.refreshToken !== refreshToken) {
      throw AuthError.InvalidAuthHeaders();
    }

    const jwtPair = this.jwtService.generatePair({ id: user.id });

    return {
      ...jwtPair,
      user,
    };
  }

  public async googleAuth(
    googleAuthInput: GoogleAuthInput,
  ): Promise<AuthResponse> {
    const email = googleAuthInput?.email;
    const token = googleAuthInput?.accessToken;

    const isValidToken = await this.verifyGoogleToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException();
    }

    let user = await this.userService.getOne({ email });

    if (!user) {
      const username = googleAuthInput?.firstName;
      user = await this.userService.create({
        email,
        username,
        provider: Provider.GOOGLE,
      });
    }

    const jwtPair = this.jwtService.generatePair({ id: user.id });

    this.userService.save({
      id: user.id,
      refreshToken: jwtPair.refreshToken,
    });

    return {
      user,
      ...jwtPair,
    };
  }

  private async verifyGoogleToken(token: string): Promise<boolean> {
    try {
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`,
      );

      console.log(googleResponse);

      if (
        googleResponse.data &&
        googleResponse.data.aud ===
          this.configService.get<string>('GOOGLE_CLIENT_ID')
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
