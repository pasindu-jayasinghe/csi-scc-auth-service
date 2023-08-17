import { Email } from "read-excel-file/types";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Role } from "./role.entity";
import { Exclude } from 'class-transformer';
import { UserAction } from "./user-action.entity";


export enum ProfileStatus {    
    InActive = -10,
    Active = 0,
    Resetting = 1,
    BlockedByWrongAttemps = 2,
    OTPValidated = 3,
    OTPFailed = 4
}
@Entity()
export class LoginProfile  extends BaseTrackingEntity{


    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({unique: true})
    userName: string; // Email

    @Column()
    password: string;

    @Exclude()
    @Column()
    salt: string;

    @ManyToMany(type => Role,  { eager: true, cascade: true })
    @JoinTable()
    roles: Role[]

    @Column({ default: ProfileStatus.Active })
    profileState: ProfileStatus;

    @Column({default: 0})
    otp: number;

    @Column({default: null, nullable: true })
    otpExpireAt: Date;

    @ManyToMany(type => UserAction,  { eager: true, cascade: false })
    @JoinTable()
    userActions: UserAction[]
}


