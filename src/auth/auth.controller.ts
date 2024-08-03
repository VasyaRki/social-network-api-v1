import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  public async googleAuthCallback(@Req() req) {
    const user = req?.user;

    return this.authService.googleAuth(user);
  }
}
