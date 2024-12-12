// Migration: create_all_table
// Created at: Thu Dec 12 10:23:31 PM WIB 2024

import { Kysely } from 'kysely';
import { Database } from '../schema';

export async function up(db: Kysely<Database>): Promise<void> {
  // Write your UP migration here
  await db.schema
    .createTable('driver_attendances')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('driver_code', 'varchar', (col) => col.notNull())
    .addColumn('attendance_date', 'varchar', (col) => col.notNull())
    .addColumn('attendance_status', 'boolean', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('driver')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('driver_code', 'varchar', (col) => col.notNull().unique())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('shipment_cost')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('driver_code', 'varchar', (col) => col.notNull())
    .addColumn('shipment_no', 'varchar', (col) => col.notNull())
    .addColumn('total_costs', 'decimal', (col) => col.notNull())
    .addColumn('cost_status', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('shipment')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('shipment_no', 'varchar', (col) => col.notNull().notNull())
    .addColumn('shipment_date', 'date', (col) => col.notNull())
    .addColumn('shipment_status', 'varchar', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('variable_config')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('key', 'varchar', (col) => col.notNull().unique())
    .addColumn('value', 'date', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  // Write your DOWN migration here
  await db.schema.dropTable('driver_attendances').execute();
  await db.schema.dropTable('driver').execute();
  await db.schema.dropTable('shipment_cost').execute();
  await db.schema.dropTable('shipment').execute();
  await db.schema.dropTable('variable_config').execute();
}
