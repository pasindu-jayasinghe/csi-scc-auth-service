import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ManagementModule } from 'src/management/management.module';
import { LoginProfileController } from './controller/loginProfile.controller';
import { RoleController } from './controller/role.controller';
import { UserActionController } from './controller/user-action.controller';
import { LoginProfile } from './entities/loginProfile.entity';
import { Role } from './entities/role.entity';
import { UserAction } from './entities/user-action.entity';
import { LoginProfileService } from './service/loginProfile.service';
import { RoleService } from './service/role.service';
import { UserActionService } from './service/user-action.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoginProfile,
      Role,
      UserAction
    ]),    
    forwardRef(() => AuthModule),
    ManagementModule
  ],
  providers: [LoginProfileService, RoleService, UserActionService],
  exports: [LoginProfileService, RoleService],
  controllers: [RoleController, LoginProfileController, UserActionController]
})
export class LoginProfileModule {}
