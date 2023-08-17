import { Injectable } from '@nestjs/common';
const MANAGEMENT_URL = process.env.MANAGEMENT_URL || 'http://localhost:7080'


@Injectable()
export class UnitService {}
