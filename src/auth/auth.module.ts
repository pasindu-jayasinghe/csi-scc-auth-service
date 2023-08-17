import { forwardRef, Module } from '@nestjs/common';
import { LoginProfileModule } from 'src/login-profile/login-profile.module';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailService } from 'src/shared/email.service';


@Module({
  controllers:[AuthController],
  imports:[        
    forwardRef(() => LoginProfileModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.JWT_expiresIn },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, EmailService],
  exports: [AuthService]
})
export class AuthModule {}
