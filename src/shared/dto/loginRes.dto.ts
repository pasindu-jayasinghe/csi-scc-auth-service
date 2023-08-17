import { LoginRole } from "src/login-profile/entities/role.entity";
import { RoleAction } from "src/login-profile/entities/user-action.entity";

export class LoginRes{
    accessToken: string;
    refreshToken: string;
    loginProfileId: string;
    roles: LoginRole[];
    creatableRoles: LoginRole[]
    userActions: RoleAction[]
}