import { Controller, Request, Post, UseGuards, Get, Body, Patch, InternalServerErrorException, Delete, Query } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { LoginProfile } from '../entities/loginProfile.entity';
import { LoginProfileService } from '../service/loginProfile.service';
import { RecordStatus } from 'src/shared/entities/base.tracking.entity';
import { RoleService } from '../service/role.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Crud({
    model: {
      type: LoginProfile,
    },
    query: {
      join: {
        roles: {
          eager: true
        },
        userActions: {
          eager: true
        }
      },
    },
  })
@Controller('login-profile')
export class LoginProfileController implements CrudController<LoginProfile> {
  
  constructor( 
      public service: LoginProfileService,
      public roleService: RoleService
  ) {}
    
  get base(): CrudController<LoginProfile> {
    return this;
  }

  // @Post('seed')
  // async seed(){
  //   return await this.service.seed();
  // }

  @Get('by-id')
  async getById(@Query('id') id: string){
    try{
      const lp = await this.service.findOne(id);            
      return lp;
    }catch(err){
      throw new InternalServerErrorException(err);
    }
  }

  @Get('get-by-role')
  async getByRole(@Query('role') role: string){
    try{
      const roles = await this.roleService.findOne({code: role})
      const lp = await this.service.getByRole(roles)           
      return lp;
    }catch(err){
      throw new InternalServerErrorException(err);
    }
  }
  

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() createLoginProfileDto: LoginProfile) {
    try{
      const isEmailTaken = await this.service.isEmailTaken(createLoginProfileDto.userName);
      if(isEmailTaken){
        throw new InternalServerErrorException("Email is already taken!!");
      }
      const lp = await this.service.addLoginProfile(createLoginProfileDto);
      return lp;
    }catch(err){
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateOneLoginProfile(@Body() dto: LoginProfile): Promise<LoginProfile> {
    try{
      const lp = await this.service.findOne(dto.id);
      if(lp.userName !== dto.userName){
        const isEmailTaken = await this.service.isEmailTaken(dto.userName);
        if(isEmailTaken){
          throw new InternalServerErrorException("Email is already taken!!");
        }
      }    
      return await this.service.updateLoginProfile(dto);
    }catch(err){
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async remove(@Query('id') id: string): Promise<LoginProfile>{
    try{
      const lp = await this.service.findOne(id);      
      lp.status = RecordStatus.Deleted; // TODO: change user status too
      delete lp.password;
      return await this.service.updateLoginProfile(lp);
    }catch(err){
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('chage-state')
  async changeState(
    @Query('id') id: string, 
    @Query('profileState') profileState: string
  ){
    try{
      const lp = await this.service.findOne(id);      

    }catch(err){
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  @Patch('update-lp-actions')
  async updateDefaultAction(){
    await this.service.updateDefaultAction();
  }
    
}