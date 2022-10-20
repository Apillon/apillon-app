export enum ServiceType {
  AUTHENTICATION = 1,
  STORAGE = 2,
  COPMUTING = 3,
}

export interface ServiceTypeInterface {
  id: number;
  name: string;
  description: string;
  active: number;
  status: number;
}
export interface ServiceTypeItem {
  id: number;
  name: string;
  icon: string;
  new?: boolean | null;
  disabled?: boolean | null;
}
