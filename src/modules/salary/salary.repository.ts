import { sql } from 'kysely';
import { DatabaseRepository } from '../../common/repositories/database';
import { ListDriverSalaryQuery } from './salary.dto';

export interface FilterDriverSalaryRow {
  driver_code: string;
  total_attendance_salary: number;
  name: string;
  total_pending: number;
  total_confirmed: number;
  total_paid: number;
  count_shipment: number;
  total_salary: number;
}
export interface FilterDriverSalaryQueryResult {
  data: FilterDriverSalaryRow[];
  total_rows: number;
}

export interface SalaryRepository {
  filterDriverSalary(
    query: ListDriverSalaryQuery,
  ): Promise<FilterDriverSalaryQueryResult>;
}

export class SalaryRepositoryImpl
  extends DatabaseRepository
  implements SalaryRepository
{
  async filterDriverSalary(
    query: ListDriverSalaryQuery,
  ): Promise<FilterDriverSalaryQueryResult> {
    let queryBuild = this.db
      .with('attendance_salary', (dbi) =>
        dbi
          .selectFrom('drivers')
          .innerJoin(
            'driver_attendances',
            'driver_attendances.driver_code',
            'drivers.driver_code',
          )
          .innerJoin('variable_configs', (join) =>
            join.on(
              'variable_configs.key',
              '=',
              'DRIVER_MONTHLY_ATTENDANCE_SALARY',
            ),
          )
          .where('driver_attendances.attendance_status', '=', true)
          .where(
            sql<number>`date_part('year', driver_attendances.attendance_date)`,
            '=',
            query.year,
          )
          .where(
            sql`date_part('month', driver_attendances.attendance_date)`,
            '=',
            query.month,
          )
          .groupBy(['drivers.driver_code', 'variable_configs.value'])
          .select([
            'drivers.driver_code',
            sql<number>`COUNT(*) * variable_configs.value`.as(
              'total_attendance_salary',
            ),
          ]),
      )
      .with('costs_summary', (dbi) =>
        dbi
          .selectFrom('drivers')
          .innerJoin(
            'shipment_costs',
            'shipment_costs.driver_code',
            'drivers.driver_code',
          )
          .innerJoin(
            'shipments',
            'shipments.shipment_no',
            'shipment_costs.shipment_no',
          )
          .where('shipments.shipment_status', '!=', 'CANCELED')
          .where(
            sql<number>`date_part('year', shipments.shipment_date)`,
            '=',
            query.year,
          )
          .where(
            sql<number>`date_part('month', shipments.shipment_date)`,
            '=',
            query.month,
          )
          .groupBy(['drivers.driver_code', 'drivers.name'])
          .select(({ fn }) => [
            'drivers.driver_code',
            'drivers.name',
            sql<number>`SUM(CASE WHEN shipment_costs.cost_status = 'PENDING' THEN shipment_costs.total_costs ELSE 0 END)`
              .$castTo<number>()
              .as('total_pending'),
            sql<number>`SUM(CASE WHEN shipment_costs.cost_status = 'CONFIRMED' THEN shipment_costs.total_costs ELSE 0 END)`.as(
              'total_confirmed',
            ),
            sql<number>`SUM(CASE WHEN shipment_costs.cost_status = 'PAID' THEN shipment_costs.total_costs ELSE 0 END)`.as(
              'total_paid',
            ),
            fn.countAll<number>().as('count_shipment'),
          ]),
      )
      .with('filtered_rows', (dbi) =>
        dbi
          .selectFrom('costs_summary')
          .innerJoin(
            'attendance_salary',
            'attendance_salary.driver_code',
            'costs_summary.driver_code',
          )
          .orderBy('costs_summary.driver_code')
          .select([
            'costs_summary.driver_code',
            'costs_summary.name',
            'costs_summary.total_paid',
            'costs_summary.total_pending',
            'costs_summary.total_confirmed',
            'attendance_salary.total_attendance_salary',
            sql<number>`costs_summary.total_pending + costs_summary.total_confirmed + costs_summary.total_paid + attendance_salary.total_attendance_salary`.as(
              'total_salary',
            ),
            'costs_summary.count_shipment',
          ]),
      )
      .selectFrom('filtered_rows')
      .where('filtered_rows.total_salary', '>', 0)
      .limit(query.page_size)
      .offset(query.page_size * (query.current - 1))
      .selectAll('filtered_rows')
      .select([
        sql<number>`(select COUNT(*) FROM filtered_rows)`.as('total_rows'),
      ]);

    if (query.driver_code) {
      queryBuild = queryBuild.where(
        'filtered_rows.driver_code',
        '=',
        query.driver_code,
      );
    }
    if (query.name) {
      queryBuild = queryBuild.where(
        'filtered_rows.name',
        'ilike',
        '%' + query.name + '%',
      );
    }
    if (query.status) {
      switch (query.status) {
        case 'PAID':
          queryBuild = queryBuild
            .where('filtered_rows.total_paid', '>', 0)
            .where('filtered_rows.total_confirmed', '=', 0)
            .where('filtered_rows.total_pending', '=', 0);
          break;
        case 'CONFIRMED':
          queryBuild = queryBuild.where(
            'filtered_rows.total_confirmed',
            '>',
            0,
          );
          break;
        case 'PENDING':
          queryBuild = queryBuild.where('filtered_rows.total_pending', '>', 0);
          break;
      }
    }
    const streams = queryBuild.stream();

    const data: FilterDriverSalaryRow[] = [];
    let total_rows = 0;
    for await (const row of streams) {
      total_rows = row.total_rows;
      data.push({
        driver_code: row.driver_code,
        total_attendance_salary: row.total_attendance_salary,
        name: row.name,
        total_pending: row.total_pending,
        total_confirmed: row.total_confirmed,
        total_paid: row.total_paid,
        count_shipment: row.count_shipment,
        total_salary: row.total_salary,
      });
    }

    return {
      total_rows,
      data,
    };
  }
}
