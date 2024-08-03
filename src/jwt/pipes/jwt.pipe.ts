import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { JWT_CONSTANTS } from '../jwt.constants';
import { JwtTypes } from '../enums/jwt-types.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtService } from '../interfaces/jwt-service.interface';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtPipe implements PipeTransform {
  constructor(
    @Inject(JWT_CONSTANTS.APPLICATION.SERVICE_TOKEN)
    private readonly jwtService: JwtService,
  ) {}

  public async transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Promise<IJwtPayload> {
    const accessToken =
      JwtAuthGuard.extractTokenFromAuthorizationHeaders(value);

    const payload: IJwtPayload = await this.jwtService.verify(
      accessToken,
      JwtTypes.Access,
    );

    return payload;
  }
}
