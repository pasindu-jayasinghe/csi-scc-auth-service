import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum RoleAction {
  MANAGE_STATUS_OF_THE_SYSTEM="MANAGE_STATUS_OF_THE_SYSTEM",
  ACCESS_RIGHT_DOCUMENT="ACCESS_RIGHT_DOCUMENT",
  CREATE_HIERARCHY="CREATE_HIERARCHY",
  EDIT_HIERARCHY="EDIT_HIERARCHY",
  ENTER_UNIT_DETAILS="ENTER_UNIT_DETAILS",
  EDIT_UNIT_DETAILS="EDIT_UNIT_DETAILS",
  CREATE_PROJECT="CREATE_PROJECT",
  EDIT_PROJECT="EDIT_PROJECT",
  DELETE_PROJECT="DELETE_PROJECT",
  EXCEL_UOLOAD_DATA_ENTER="EXCEL_UOLOAD_DATA_ENTER",
  DATA_ENTER="DATA_ENTER",
  DATA_EDIT="DATA_EDIT",
  DATA_DELETE="DATA_DELETE",
  COMPLENESS_CHECK="COMPLENESS_CHECK",
  COMPLENESS_CHECK_VERIFY="COMPLENESS_CHECK_VERIFY",
  PROJECT_SUMMARY="PROJECT_SUMMARY",
  ORG_SUMMARY="ORG_SUMMARY",
  PROJECT_VERIFICATION="PROJECT_VERIFICATION",
  REQUEST_EVIDENCE="REQUEST_EVIDENCE",
  PROVIDE_EVIDENCE="PROVIDE_EVIDENCE",
  ORGANISATION_WISE_REPORT_GENERATION="ORGANISATION_WISE_REPORT_GENERATION",
  DATA_ENTER_FOR_REPORTS_GENERATION="DATA_ENTER_FOR_REPORTS_GENERATION",
  REPORT_GENERATION="REPORT_GENERATION",
  DATA_DOWNLOAD="DATA_DOWNLOAD",
  EMISSION_FACTOR_MANAGEMENT="EMISSION_FACTOR_MANAGEMENT",
  PROJECT_STATUS_CHANGE="PROJECT_STATUS_CHANGE",
  IMPORT_USERS = "IMPORT_USERS",
  EXPORT_USERS = "EXPORT_USERS",
  UNIT_WISE_TOTAL_SEE = "UNIT_WISE_TOTAL_SEE",
}

@Entity()
export class UserAction  extends BaseTrackingEntity{

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: RoleAction,
      })
    code: string;

}


