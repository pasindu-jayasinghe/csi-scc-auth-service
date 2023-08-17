import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfileStatus } from 'src/login-profile/entities/loginProfile.entity';
import { LoginRole } from 'src/login-profile/entities/role.entity';
import { LoginProfileService } from 'src/login-profile/service/loginProfile.service';
import { RoleService } from 'src/login-profile/service/role.service';
import { LoginRes } from 'src/shared/dto/loginRes.dto';
import { ValidatedProfileDto } from 'src/shared/dto/validatedProfile.credential.dto';
import { EmailService } from 'src/shared/email.service';
import { RecordStatus } from 'src/shared/entities/base.tracking.entity';
import { jwtConstants } from '../constants';
import { RefreshReqRes } from '../dto/refreshReqRes.dto';


@Injectable()
export class AuthService{

    constructor(
        private loginProfileService: LoginProfileService,
        private jwtService: JwtService,     
        private emailService: EmailService,
        private roleService: RoleService
    ) {
    }

    async validateLoginProfile(username: string, pass: string): Promise<ValidatedProfileDto> {
      return await this.loginProfileService.validateLoginProfile(username, pass);
    }

    private getAcceesToken(payload: any): string{
      return this.jwtService.sign(payload);
    }

    private getSystemAcceesToken(payload: any): string{
      return this.jwtService.sign(payload, {expiresIn: jwtConstants.JWT_System_expiresIn, secret: jwtConstants.secret});
    }


    private getRefreshToken(payload: any){
      return this.jwtService.sign({...payload, refresh: true}, {expiresIn: jwtConstants.JWT_refresh_expiresIn, secret: jwtConstants.refreshSecret});
    }

    private async validate(token: string){
      const res = await this.jwtService.verifyAsync(token, {secret: jwtConstants.refreshSecret});
      return true;
    }

    async refresh(refreshReq: RefreshReqRes, loginProfile: ValidatedProfileDto): Promise<RefreshReqRes>{
      const isValid = await this.validate(refreshReq.token);
      let creatableRoles = await this.roleService.getCreatableRoles(loginProfile.roles  as LoginRole[])
      if(isValid){
        const payload = {
          username: loginProfile.username, 
          sub: loginProfile.id,
          roles: loginProfile.roles,
          userActions: loginProfile.userActions,
          creatableRoles: creatableRoles
        };
        refreshReq.token = this.getAcceesToken(payload)
        return refreshReq;
      }else{
        throw new UnauthorizedException();
      }
    }

    async systemLogin(loginProfile: ValidatedProfileDto): Promise<LoginRes>{
      if(loginProfile.roles.length === 0){
        const payload = {
          username: loginProfile.username, 
          sub: loginProfile.id,
          role: loginProfile.roles,
          userActions: loginProfile.userActions,
          creatableRoles: []
         };
        return {
          accessToken: this.getSystemAcceesToken(payload),
          refreshToken: "No",
          loginProfileId: loginProfile.id,
          roles: loginProfile.roles, 
          userActions: loginProfile.userActions,
          creatableRoles: []
        };
      }else{
        return null;
      }
    }

    async login(loginProfile: ValidatedProfileDto): Promise<LoginRes> {
      let creatableRoles = await this.roleService.getCreatableRoles(loginProfile.roles  as LoginRole[])
      const payload = {
        username: loginProfile.username, 
        sub: loginProfile.id,
        roles: loginProfile.roles,
        userActions: loginProfile.userActions,
        creatableRoles: creatableRoles
       };
      return {
        accessToken: this.getAcceesToken(payload),
        refreshToken: this.getRefreshToken(payload),
        loginProfileId: loginProfile.id,
        roles: loginProfile.roles, 
        userActions: loginProfile.userActions,
        creatableRoles: creatableRoles
      };
    }

    async forgotPasswordRequest(userName: string): Promise<boolean>{
      try{

        const profile = await this.loginProfileService.getByUserName(userName);

        if((profile.profileState === ProfileStatus.Active || profile.profileState === ProfileStatus.Resetting) && profile.status === RecordStatus.Active){
          profile.profileState = ProfileStatus.Resetting;
          profile.otp = this.getOTP(1000, 9999); 
          profile.otpExpireAt = new Date(new Date().getTime() + 5*60000);
          let p = await this.loginProfileService.update(profile.id, profile);
          this.emailService.send(userName,'OTP for password reset', profile.otp.toString());       
          return true; 
        }else{
          console.log("cdn")
          return false;
        }
      }catch(err){
        throw new InternalServerErrorException(err);
      }
    }

    async checkOTP(userName: string, otp: number): Promise<{status: boolean,message: string}>{
      const profile = await this.loginProfileService.getByUserName(userName);
      let now = new Date();
      let exp = profile.otpExpireAt;
      let diff =  exp.getTime() - now.getTime();
      if(profile.profileState === ProfileStatus.Resetting && profile.otp === otp && diff > 0){
        profile.otp = 0;
        profile.profileState = ProfileStatus.OTPValidated;
        await this.loginProfileService.update(profile.id, profile);
        return {status: true, message: ''};
      }else{
        let m = "";
        if(profile.otp !== otp){
          m = "OTP is not matching"
        }else if(diff < 0){
          m = "OTP is expired"
        }
        return {status: false, message: m};
      }
    }

    async reset(username: string, pass: string){
      const profile = await this.loginProfileService.getByUserName(username);
      if(profile.profileState === ProfileStatus.OTPValidated){
        profile.password = pass;
        profile.profileState = ProfileStatus.Active;
        await this.loginProfileService.updateLoginProfile(profile);
        return true;
      }

      return false;
    }

    getOTP(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
