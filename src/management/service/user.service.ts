import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
const MANAGEMENT_URL = process.env.MANAGEMENT_URL || 'http://localhost:7080' // TODO" load .env


@Injectable()
export class UserService {

    constructor(private httpService: HttpService){}

    async initMasterAdmin(dto: CreateUserDto, token:string){
        const options = {
            headers: {
                'Authorization': token
            }
        }
        const url = `${MANAGEMENT_URL}/users/add-master-admin`
        this.httpService.post(url, dto, options).subscribe(res => console.log(res.data));        
    }
}
