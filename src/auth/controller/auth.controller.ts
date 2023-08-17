import { Controller, Request, Post, UseGuards, Get, Body, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../service/auth.service';
import { AuthCredentialDto } from '../dto/auth.credential.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ValidatedProfileDto } from 'src/shared/dto/validatedProfile.credential.dto';
import { LoginRes } from 'src/shared/dto/loginRes.dto';
import { RefreshReqRes } from '../dto/refreshReqRes.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetRes } from '../dto/resetRes.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private readonly mailerService: MailerService) {}
    

    @UseGuards(LocalAuthGuard)
    @Post('system-login')
    async systemLogin(@Body() body: AuthCredentialDto, @Request() req: {user: ValidatedProfileDto}): Promise<LoginRes> {
        return this.authService.systemLogin(req.user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('check-old-password')
    async checkOldPassword(@Body() body: AuthCredentialDto, @Request() req: {user: ValidatedProfileDto}): Promise<boolean> {
        return true;
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() body: AuthCredentialDto, @Request() req: {user: ValidatedProfileDto}): Promise<LoginRes> {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    async refresh(@Body() body: RefreshReqRes, @Request() req: {user: ValidatedProfileDto}){
        return this.authService.refresh(body, req.user);
    }

    @Post('forgot-password')
    async forgotPassword(@Query('userName') userName: string): Promise<ResetRes>{
        try{
            const isSentOTP = await this.authService.forgotPasswordRequest(userName);
            if(isSentOTP){
                const res = new ResetRes();
                res.status = true;
                res.message = "Plese check your email";
                return res;
            }else{
                const res = new ResetRes();
                res.status = false;
                res.message = "Invalid email or account is blocked";
                return res;
            }            
        }catch(err){
            const res = new ResetRes();
            res.status = false;
            res.message = "Invalid email or account is blocked";
            return res;
        }
    }

    @Post('check-otp')
    async submitOTP(@Query('userName') userName: string, @Query('otp') otp: number): Promise<ResetRes>{
        try{        
            const isValid = await this.authService.checkOTP(userName, parseInt(otp.toString()))
            const res = new ResetRes();            
            if(!isValid.status){
                res.status = false;
                res.message = isValid.message
            }else{
                res.status = true;
                res.message = "OTP validated"
            }
            return res;
        }catch(err){
            const res = new ResetRes();
            res.status = false;
            res.message = "Failed to validate OTP";
            return res;
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() body: AuthCredentialDto): Promise<ResetRes>{
        try{
            const isReset = await this.authService.reset(body.username, body.password);
            const res = new ResetRes();            
            if(!isReset){
                res.status = false;
                res.message = "Please check the OTP"
            }else{
                res.status = true;
                res.message = "Reset succesfully"
            }
            return res;
        }catch(err){
            const res = new ResetRes();
            res.status = false;
            res.message = "Failed to reset password";
            return res;
        }
    }



}