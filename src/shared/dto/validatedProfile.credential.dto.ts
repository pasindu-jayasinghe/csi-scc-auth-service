import { LoginRole } from "src/login-profile/entities/role.entity";
import { RoleAction } from "src/login-profile/entities/user-action.entity";

export class ValidatedProfileDto{
    id: string;
    username: string;
    roles: LoginRole[];
    userActions: RoleAction[]
}