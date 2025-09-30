export interface IMedicalReading {
  mpvId: number;
  parameterId: number;
  SessionId: number;
  DeviceId: number;
  MinRange: number;
  MaxRange: number;
  PeriodStart: string;
  PeriodEnd: string;
  Time: string;
  ColumnDisplay: string;
  Category: string;
  Name: string;
  Value: string;
  EnumCode: string | null;
  EnumDescription: string | null;
  Comment: string;
  LowValue: number | null;
  HighValue: number | null;
  Tooltip: string;
  IsHighLimit: boolean;
  IsLowLimit: boolean;
  IsComment: boolean;
  IsHighValue: boolean;
  IsLowValue: boolean;
  IsEvent: boolean;
  IsInject: boolean;
  Operation: number;
  DefaultLineColor: number;
  GroupSortSeq: number;
  SortSeq: number;
}

export interface ICategoryGroup {
  category: string;
  readings: IMedicalReading[];
  sortSeq: number;
}

export interface ITimePeriod {
  periodStart: Date;
  periodEnd: Date;
  columnDisplay: string;
  readings: IMedicalReading[];
}

export interface IVitalSignRow {
  category: string;
  name: string;
  parameterId: number;
  minRange: number;
  maxRange: number;
  values: Map<string, IMedicalReading>;
  sortSeq: number;
}

export interface IAPIResponse<T = IMedicalReading[]> {
  data: T;
  success?: boolean;
  message?: string;
}
