import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { RoleAction, UserAction } from '../entities/user-action.entity';

@Injectable()
export class UserActionService extends TypeOrmCrudService<UserAction> {

  constructor(@InjectRepository(UserAction) repo, @InjectRepository(UserAction) private readonly roleRepository: Repository<UserAction>) {
    super(repo);
  }

  seed(){
    let keys = Object.keys(RoleAction);
    keys.forEach(async key => {
      try{
        let saved =await this.repo.find({code: key});
        if(saved.length === 0){
          let ua = new UserAction();
          ua.code = key;
          ua.name = key.toLowerCase().replace("_", " ");
  
          try{
            this.repo.save(ua);
          }catch(err){
            console.log(key,"-not saved", ua);
          }
        }
      }catch(err){
        console.log(key, " can not find")
      }    
    })
  }
}
