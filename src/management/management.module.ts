import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ManagementSeedService } from './service/managementSeed.service';
import { UserService } from './service/user.service';

@Module({
  imports: [HttpModule],
  providers: [UserService, ManagementSeedService],
  exports: [UserService, ManagementSeedService]
})
export class ManagementModule {}
