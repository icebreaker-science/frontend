export interface Availability {
  id?: number;
  accountId?: number;
  deviceId: number;
  comment?: string;
  germanPostalCode?: string;
  institution: string;
  researchGroup?: string;
  disabled: boolean;
}
