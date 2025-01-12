import { Controller, Post, Body, HttpCode, HttpStatus, Get, Req, Query, Scope, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  oAuth2Client: OAuth2Client
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('google/authUrl')
  async generateAuthUrl() {
    const oAuth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/auth/google/callback'
    });

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    return authorizeUrl;
  }

  @Get('google/callback')
  async googleCallback(@Res({ passthrough: true }) response: Response, @Query('code') code: string) {
    console.log('CODE: ', code);
    const oAuth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/auth/google/callback'
    });
    
    const { tokens } = await oAuth2Client.getToken(code);
    response.cookie('credentials', tokens);
  }

  @Get('google/req')
  async requestingGoogle(@Req() req: Request) {
    
    const oAuth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/auth/google/callback',
      credentials: req.cookies.credentials
    });

    const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
    const response = await oAuth2Client.request({ url });
    console.log(response.data);
    const tokenInfo = await oAuth2Client.getTokenInfo(oAuth2Client.credentials.access_token + '');
    console.log(tokenInfo);

    return { response, tokenInfo }
  }



}
