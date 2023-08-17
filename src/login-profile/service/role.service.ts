import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { In, Repository } from 'typeorm';
import { LoginRole, Role } from '../entities/role.entity';
import { UserActionService } from './user-action.service';
import { UserAction } from '../entities/user-action.entity';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  

  constructor(@InjectRepository(Role) repo,
   @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
   private userActionService: UserActionService
  ) {
    super(repo);
  }

  async getUniqueUserActionOfRoleList(roleIds: number[]){
    let roles = this.repo.find({id: In(roleIds)});

    let ids = [];
    let userActions: UserAction[] = []
    await Promise.all((await roles).map(async role => {
      role.defaultUserActions.map(ua =>{
        userActions.push(ua);
        ids.push(ua.id)
        return ua.id;
      });    
    }))

    let unique = [...new Set(ids)];
    return unique.map(u => userActions.find(a => a.id === u));
  }


  async addCreatableRoles(roleId: number, loginRoles: LoginRole[]){

    const role =  await this.repo.findOne(roleId);
    if(role){
      let cereabable = role.getCreatableRoles();
      if(typeof loginRoles === 'string'){
        loginRoles = [loginRoles];
      }
      loginRoles.forEach(role => {
        if(!cereabable.includes(role)){
          cereabable.push(role);
        }
      })
      try{
        let update = await this.repo.update({id: roleId}, {creatableRoles: cereabable.join(",")})
        if(update.affected === 1){
          return true;
        }else{
          return false;
        }
      }catch(err){
        console.log(err);
        return false;
      }
    }else{
      return false;
    }
  }

  async removeCreatableRoles(roleId: number, loginRole: LoginRole){
    const role =  await this.repo.findOne(roleId);
    if(role){
      let cereabable = role.getCreatableRoles();
      cereabable = cereabable.filter(c => c!== loginRole);
      try{
        let update = await this.repo.update({id: roleId}, {creatableRoles: cereabable.join(",")})
        if(update.affected === 1){
          return true;
        }else{
          return false;
        }
      }catch(err){
        console.log(err);
        return false;
      }
    }else{
      return false;
    }
  }


  async addUserAction(roleId: number, actionIds: number[]){
    const role =  await this.repo.findOne(roleId);
    if(role){    
      try{
        let actions= role.defaultUserActions;
        if(!actions){
          actions = []
        }

        if(typeof actionIds === 'string'){
          actionIds = [actionIds];
        }
        await Promise.all(actionIds.map(async actionId => {
          let action = await this.userActionService.findOne(actionId);
          if(action){
            actions = actions.filter(a => a.id !== actionId)
            actions.push(action);
          }
        }))
        role.defaultUserActions = actions;
        let res = await this.repo.save(role);
        return true;          
      }catch(err){
        console.log(err);
        return false;
      }
    }else{
      return false;
    }
  }


  async removeUserAction(roleId: number, actionId: number){
    const role =  await this.repo.findOne(roleId);
    if(role){    
      try{
        let action = await this.userActionService.findOne(actionId);
        if(action){
          let actions= role.defaultUserActions;
          if(!actions){
            actions = []
          }
          role.defaultUserActions = actions.filter(a => a.id !== parseInt(actionId+""))         
          let res = await this.repo.save(role);
          return true;         
        }else{
          console.log("lo action")
          return false;
        }
      }catch(err){
        console.log(err);
        return false;
      }
    }else{
      return false;
    }
  }


  
  async seed() {
    const MA =  await this.repo.find({code: LoginRole.MASTER_ADMIN});    
    if(MA.length === 0){
      await this.addMasterAdmin();
    }

    const SCA =  await this.repo.find({code: LoginRole.CSI_ADMIN});
    if(SCA.length === 0){
      await this.addCSIAdmin();
    }

    const OA =  await this.repo.find({code: LoginRole.ORG_ADMIN});
    if(OA.length === 0){
      await this.addOrgAdmin();
    }

    const OU =  await this.repo.find({code: LoginRole.ORG_USER});
    if(OU.length === 0){
      await this.addOrgUser();
    } 

    const AU =  await this.repo.find({code: LoginRole.AUDITOR});
    if(AU.length === 0){
      await this.addAuditot();
    } 

    const DEO =  await this.repo.find({code: LoginRole.DEO});
    if(DEO.length === 0){
      await this.addDEO();
    } 

    const EFM =  await this.repo.find({code: LoginRole.EF_MANAGER});
    if(EFM.length === 0){
      await this.addEFManager();
    } 

    const SU =  await this.repo.find({code: LoginRole.SBU_ADMIN});
    if(SU.length === 0){
      await this.addSA();
    } 

    const BA =  await this.repo.find({code: LoginRole.CLIMATESI_BA});
    if(BA.length === 0){
      await this.addBA();
    } 

    const SUA =  await this.repo.find({code: LoginRole.SBU_ADMIN});
    if(SUA.length === 0){
      await this.addSA();
    } 

    const HD =  await this.repo.find({code: LoginRole.CLIMATESI_HEADS});
    if(HD.length === 0){
      await this.addCsiHead();
    } 
    
    const TL =  await this.repo.find({code: LoginRole.CLIMATESI_TL});
    if(TL.length === 0){
      await this.addTL();
    } 

    const FP =  await this.repo.find({code: LoginRole.CLIMATESI_FP});
    if(FP.length === 0){
      await this.addFP();
    } 
    
    const CSIUSER =  await this.repo.find({code: LoginRole.CLIMATESI_USERS});
    if(CSIUSER.length === 0){
      await this.addCsiUser();
    } 

    const CSIT =  await this.repo.find({code: LoginRole.CLIMATESI_TRAINEES});
    if(CSIT.length === 0){
      await this.addCsiTrainee();
    }

    const COMA =  await this.repo.find({code: LoginRole.COM_ADMIN});
    if(COMA.length === 0){
      await this.addComAdmin();
    } 

    const OPA =  await this.repo.find({code: LoginRole.OPERATIONAL_ADMIN});
    if(OPA.length === 0){
      await this.addOA();
    } 

    const SBU =  await this.repo.find({code: LoginRole.SBU_ADMIN});
    if(SBU.length === 0){
      await this.addSBUAdmin();
    } 
    const FMU =  await this.repo.find({code: LoginRole.FINANCIAL_MANAGER});
    if(FMU.length === 0){
      await this.addFM();
    } 
  }

  private async addMasterAdmin(){
    const ma = new Role();
    ma.name = "Master Admin";
    ma.code =LoginRole.MASTER_ADMIN;
    await this.roleRepository.save(ma);
  }
  private async addCSIAdmin(){
    const ma = new Role();
    ma.name = "ClimateSI Admin ";
    ma.code =LoginRole.CSI_ADMIN;
    await this.roleRepository.save(ma);
  }
  private async addOrgAdmin(){
    const ma = new Role();
    ma.name = "Admin";
    ma.code =LoginRole.ORG_ADMIN;
    await this.roleRepository.save(ma);
  }

  private async addOrgUser(){
    const ma = new Role();
    ma.name = "User";
    ma.code =LoginRole.ORG_USER;
    await this.roleRepository.save(ma);
  }

  private async addAuditot(){
    const ma = new Role();
    ma.name = "Auditor";
    ma.code =LoginRole.AUDITOR;
    await this.roleRepository.save(ma);
  }

  private async addDEO(){
    const ma = new Role();
    ma.name = "Data Entry Operator";
    ma.code =LoginRole.DEO;
    await this.roleRepository.save(ma);
  }

  private async addEFManager(){
    const ma = new Role();
    ma.name = "Emission Factor Manager";
    ma.code =LoginRole.EF_MANAGER;
    await this.roleRepository.save(ma);
  }



  private async addSA(){
    const ma = new Role();
    ma.name = "Supper Admin";
    ma.code =LoginRole.SUPER_ADMIN;
    await this.roleRepository.save(ma);
  }

  private async addBA(){
    const ma = new Role();
    ma.name = "Business Analyst";
    ma.code =LoginRole.CLIMATESI_BA;
    await this.roleRepository.save(ma);
  }
  private async addCsiHead(){
    const ma = new Role();
    ma.name = "ClimateSI Heads";
    ma.code =LoginRole.CLIMATESI_HEADS;
    await this.roleRepository.save(ma);
  }
  private async addTL(){
    const ma = new Role();
    ma.name = "Team Lead";
    ma.code =LoginRole.CLIMATESI_TL;
    await this.roleRepository.save(ma);
  }
  private async addFP(){
    const ma = new Role();
    ma.name = "Forcal Point";
    ma.code =LoginRole.CLIMATESI_FP;
    await this.roleRepository.save(ma);
  }
  private async addCsiUser(){
    const ma = new Role();
    ma.name = "ClimateSI User";
    ma.code =LoginRole.CLIMATESI_USERS;
    await this.roleRepository.save(ma);
  }
  private async addCsiTrainee(){
    const ma = new Role();
    ma.name = "ClimateSI Trainee";
    ma.code =LoginRole.CLIMATESI_TRAINEES;
    await this.roleRepository.save(ma);
  }
  private async addComAdmin(){
    const ma = new Role();
    ma.name = "Organization Admin";
    ma.code =LoginRole.COM_ADMIN;
    await this.roleRepository.save(ma);
  }
  private async addSBUAdmin(){
    const ma = new Role();
    ma.name = "SBU Admin";
    ma.code =LoginRole.SBU_ADMIN;
    await this.roleRepository.save(ma);
  }
  private async addOA(){
    const ma = new Role();
    ma.name = "Operational Admin";
    ma.code =LoginRole.OPERATIONAL_ADMIN;
    await this.roleRepository.save(ma);
  }
  private async addFM(){
    const fm = new Role();
    fm.name = "Financial manager";
    fm.code =LoginRole.FINANCIAL_MANAGER;
    await this.roleRepository.save(fm);
  }

  async getCreatableRoles(loginRoles: LoginRole[]) {
    let creatableRoles: LoginRole[] = [];
    let selectedRoles = await this.repo.find({code: In(loginRoles)});
    selectedRoles.forEach(r => {
      creatableRoles = [...creatableRoles, ...r.getCreatableRoles()]
    })
    let unique = [...new Set(creatableRoles)];
    return unique;
  }

}
