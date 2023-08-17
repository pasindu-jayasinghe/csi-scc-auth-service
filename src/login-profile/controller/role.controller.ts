import { Controller, Request, Post, UseGuards, Get, Body, Patch, Query, InternalServerErrorException } from '@nestjs/common';
import { LoginRole, Role } from '../entities/role.entity';
import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { RoleService } from '../service/role.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Crud({
    model: {
      type: Role,
    },
    query: {
      join: {
        defaultUserActions: {
          eager: true
        }
      },
    },
  })
  @UseGuards(JwtAuthGuard)
@Controller('role')
export class RoleController implements CrudController<Role> {
    constructor( 
        public service: RoleService,
    ) {}
    
    get base(): CrudController<Role> {
        return this;
    }


    @Patch('add-creatable-role')
    async addCreatableRoles(
      @Query('roleId') roleId: number, 
      @Query('roles') roles: LoginRole[]
    ){
      try{
        return await this.service.addCreatableRoles(roleId, roles);      
      }catch(err){
        console.log(err);
        throw new InternalServerErrorException(err);
      }
    }
  
    @Patch('remove-creatable-role')
    async removeCreatableRoles(
      @Query('roleId') roleId: number, 
      @Query('role') role: LoginRole
    ){
      try{
        return await this.service.removeCreatableRoles(roleId, role);      
      }catch(err){
        console.log(err);
        throw new InternalServerErrorException(err);
      }
    }

    @Patch('remove-user-action')
    async removeUserAction(
      @Query('roleId') roleId: number, 
      @Query('actionId') actionId: number
    ){
      try{
        return await this.service.removeUserAction(roleId, actionId);      
      }catch(err){
        console.log(err);
        throw new InternalServerErrorException(err);
      }
    }

    @Patch('add-user-action')
    async addUserAction(
      @Query('roleId') roleId: number, 
      @Query('actionId') actionIds: number[]
    ){
      try{
        return await this.service.addUserAction(roleId, actionIds);      
      }catch(err){
        console.log(err);
        throw new InternalServerErrorException(err);
      }
    }


    @Get('get-creatable-roles')
    async getCreatableRoles(
      @Query('roles') loginRoles: LoginRole[]
    ){
      try{
        return await this.service.getCreatableRoles(loginRoles);      
      }catch(err){
        console.log(err);
        throw new InternalServerErrorException(err);
      }
    }

    @Post('seed')
    async seed(){
      this.service.seed();
    }
    
}