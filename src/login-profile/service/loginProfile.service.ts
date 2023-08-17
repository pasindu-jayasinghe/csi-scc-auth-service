import { Injectable, InternalServerErrorException, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { LoginProfile, ProfileStatus } from '../entities/loginProfile.entity';
import * as bcript from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatedProfileDto } from 'src/shared/dto/validatedProfile.credential.dto';
import { RoleService } from './role.service';
import { LoginRole, Role } from '../entities/role.entity';
import { RecordStatus } from 'src/shared/entities/base.tracking.entity';
import { UserService } from 'src/management/service/user.service';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import { RoleAction } from '../entities/user-action.entity';


@Injectable()
export class LoginProfileService extends TypeOrmCrudService<LoginProfile>{

    constructor(
      private roleService: RoleService,
      @InjectRepository(LoginProfile) repo,

      @InjectRepository(LoginProfile)
      private readonly loginProfileRepository: Repository<LoginProfile>,
      private userService: UserService
    ) {
      super(repo);
    }

  async systemLoginSeed(){
    const SY_MAILA = "systemuserfdbkn@gmail.com";
    const SY =  await this.find({userName: SY_MAILA});
    if(SY.length === 0){
      const ma = new LoginProfile();
      ma.userName = SY_MAILA;
      ma.password = "cdnkjn^%567fnfdkjnk98323293";
      const lp = await this.addLoginProfile(ma);
      return {
        id: lp.id, 
        userName: lp.userName
      };
    }
  }

  async seed() {


    const MA_EMAIL = "admin@gmail.com";

    const MA =  await this.find({userName: MA_EMAIL});
    const MA_R =  await this.roleService.find({code: LoginRole.MASTER_ADMIN});

    if(MA.length === 0 && MA_R.length > 0){
      const ma = new LoginProfile();
      ma.userName = MA_EMAIL;
      ma.password = "abcd1234";
      ma.roles = [MA_R[0]];
      const lp = await this.addLoginProfile(ma);
      // await this.addMasterAdmin(lp.id, lp.userName, token);

      return {
        id: lp.id, 
        userName: lp.userName
      };
    }

    if(MA.length > 0){
      // await this.addMasterAdmin(MA[0].id, MA[0].userName, token);
      return {
        id: MA[0].id, 
        userName: MA[0].userName
      };
    }
  }


  async validateLoginProfile(username: string, pass: string): Promise<ValidatedProfileDto> {
    const profile = await this.repo.findOne({userName: username});
    if(profile && profile.status === RecordStatus.Active && profile.profileState === ProfileStatus.Active){
      const encriptedPass = await bcript.hash(pass, profile.salt);
      if(encriptedPass === profile.password){
        const validatedProfileDto  = new ValidatedProfileDto();
        validatedProfileDto.roles = profile.roles.map(role => role.code as LoginRole)
        validatedProfileDto.username = profile.userName;
        validatedProfileDto.id = profile.id;
        validatedProfileDto.userActions = profile.userActions.map(u => u.code as RoleAction);
        return validatedProfileDto;
      }
    }
    return null;
  }

  async updateLoginProfile(dto: LoginProfile): Promise<LoginProfile>{
    const lp = await this.repo.findOne(dto.id);
    if(dto.password){
      dto.password = await this.hashPassword(dto.password, lp.salt);
    }

    if(!dto.userActions || dto.userActions.length == 0){
      dto.userActions = lp.userActions;
    }
    return await this.repo.save(dto);
  }

  async addLoginProfile(createLoginProfileDto: LoginProfile): Promise<LoginProfile>{
    try{
      const salt = await bcript.genSalt(10);
      createLoginProfileDto.salt = salt.toString();
      createLoginProfileDto.password = await this.hashPassword(createLoginProfileDto.password, salt);

      let actions = await this.roleService.getUniqueUserActionOfRoleList(createLoginProfileDto.roles.map(r => r.id));
      createLoginProfileDto.userActions = actions;
      const lp =  await this.loginProfileRepository.save(createLoginProfileDto);
      return lp;
    }catch(err){
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }


  async addMasterAdmin(lpId: string, email: string, token:string){  

    const u = new CreateUserDto();
    u.email = email;
    u.firstName = "Master";
    u.lastName = "Admin";
    u.loginProfile = lpId;
    u.telephone="";
    await this.userService.initMasterAdmin(u, token);
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcript.hash(password, salt);
  }

  async isEmailTaken(email: string): Promise<boolean>{
    const userWithEmail = await this.repo.find({userName: email})    
    return userWithEmail.length > 0;
  }

  async update(id: string, lp: LoginProfile): Promise<void>{
    lp.id = id;
    await this.repo.save(lp);
  }

  async getByUserName(userName: string){
    const profile = await this.repo.findOne({userName: userName});
    return profile;
  }

  async getByRole(role: Role){
    let roles = [role.code]
    let data = await this.repo
    .createQueryBuilder("loginProfile")
    .leftJoinAndSelect("loginProfile.roles", "role")
    .where('role.code in (:...roles)',{roles})
    .getMany()

    return data.map(d => {return d.id})
  }

  // run  only at first time
  async updateDefaultAction(){
    let lpList = this.repo.find();
    await Promise.all((await lpList).map(async lp => {
      let roleIds = lp.roles.map(r => r.id);
      let userActions = await this.roleService.getUniqueUserActionOfRoleList(roleIds);
      lp.userActions = userActions;
      await this.repo.save(lp);
    }))
  }





}
