import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
const MANAGEMENT_URL = process.env.MANAGEMENT_URL || 'http://localhost:7080' // TODO" load .env


@Injectable()
export class ManagementSeedService {

    constructor(private httpService: HttpService){}


    async seed(token: string){
        const options = {
            headers: {
                'Authorization': token
            }
        }
        const url = `${MANAGEMENT_URL}/seed-all`;
        await this.httpService.post(url, {}, options).toPromise();
    }    
}
