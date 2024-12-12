import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface DriverAttendanceTable {
  id: Generated<number>;
  driver_code: string;
  attendance_date: string;
  attendance_status: boolean;
}
export type DriverAttendance = Selectable<DriverAttendanceTable>;
export type NewDriverAttendance = Insertable<DriverAttendanceTable>;
export type DriverAttendanceUpdate = Updateable<DriverAttendanceTable>;

export interface DriverTable {
  id: Generated<number>;
  driver_code: string;
  name: string;
}
export type Driver = Selectable<DriverTable>;
export type NewDriver = Insertable<DriverTable>;
export type DriverUpdate = Updateable<DriverTable>;

export type ShipmentCostCostStatus = 'PAID' | 'CONFIRMED' | 'PENDING';
export interface ShipmentCostTable {
  id: Generated<number>;
  driver_code: string;
  shipment_no: string;
  total_costs: number;
  cost_status: ShipmentCostCostStatus;
}
export type ShipmentCost = Selectable<ShipmentCostTable>;
export type NewShipmentCost = Insertable<ShipmentCostTable>;
export type ShipmentCostUpdate = Updateable<ShipmentCostTable>;

export type ShipmentShipmentStatus = 'DONE' | 'RUNNING' | 'CANCELED';
export interface ShipmentTable {
  id: Generated<number>;
  shipment_no: string;
  shipment_date: string;
  shipment_status: ShipmentShipmentStatus;
}
export type Shipment = Selectable<ShipmentTable>;
export type NewShipment = Insertable<ShipmentTable>;
export type ShipmentUpdate = Updateable<ShipmentTable>;

export type VariableConfigTable = {
  id: Generated<number>;
  key: string;
  value: string;
};
export type VariableConfig = Selectable<VariableConfigTable>;
export type NewVariableConfig = Insertable<VariableConfigTable>;
export type VariableConfigUpdate = Updateable<VariableConfigTable>;

export interface Database {
  driver_attendances: DriverAttendanceTable;
  drivers: DriverTable;
  shipment_costs: ShipmentCostTable;
  shipments: ShipmentTable;
  variable_configs: VariableConfigTable;
}
