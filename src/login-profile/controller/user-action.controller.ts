import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAction } from '../entities/user-action.entity';
import { UserActionService } from '../service/user-action.service';

@Crud({
    model: {
      type: UserAction,
    },
    query: {
      join: {
        
      },
    },
  })
@UseGuards(JwtAuthGuard)
@Controller('user-action')
export class UserActionController implements CrudController<UserAction> {

    

    constructor( 
        public service: UserActionService,
    ) {}
    
    get base(): CrudController<UserAction> {
        return this;
    }

    @Post('seed')
    async seed(){
      this.service.seed();
    }

    
}