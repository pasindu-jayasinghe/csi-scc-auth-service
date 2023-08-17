import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAction } from "./user-action.entity";

export enum LoginRole {
    CSI_ADMIN = "CSI_ADMIN", // TODO: remove
    ORG_ADMIN = "ORG_ADMIN", // TODO: remove
    ORG_USER = "ORG_USER",   // TODO: remove
    

    MASTER_ADMIN = "MASTER_ADMIN", // already
    SUPER_ADMIN="SUPER_ADMIN",
    CLIMATESI_BA="CLIMATESI_BA",
    CLIMATESI_HEADS="CLIMATESI_HEADS",
    CLIMATESI_TL="CLIMATESI_TL",
    CLIMATESI_FP="CLIMATESI_FP",
    CLIMATESI_USERS="CLIMATESI_USERS",
    EF_MANAGER = "EF_MANAGER", // already
    CLIMATESI_TRAINEES="CLIMATESI_TRAINEES",
    COM_ADMIN="COM_ADMIN",
    SBU_ADMIN="SBU_ADMIN",
    OPERATIONAL_ADMIN="OPERATIONAL_ADMIN",
    DEO = "DEO", // already
    AUDITOR = "AUDITOR", // already
    NO_ACTION="NO_ACTION",
    FINANCIAL_MANAGER="FINANCIAL MANAGER",

}
@Entity()
export class Role  extends BaseTrackingEntity{


    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: LoginRole,
      })
    code: string;

    @Column({nullable: false, default: "NO_ACTION"})
    creatableRoles: string;

    @ManyToMany(type => UserAction,  { eager: true, cascade: true })
    @JoinTable()
    defaultUserActions: UserAction[]

    getCreatableRoles(){
        return this.creatableRoles.split(",") as LoginRole[];
    }

}


