import z from 'zod';
import { ShipmentCostCostStatus } from '../../db/schema';

const monthQuerySchema = z
  .number({ invalid_type_error: 'month must be number' })
  .positive({ message: 'month must be positive number' })
  .min(1, { message: 'month must be greater or equal to 1' })
  .max(12, { message: 'month must be less or equal to 12' });
const yearQuerySchema = z
  .number({ invalid_type_error: 'year must be number' })
  .positive({ message: 'year must be positive number' })
  .min(2000, { message: 'year must be greater or equal to 2000' })
  .max(3000, { message: 'year must be less or equal to 3000' });
const currentQuerySchema = z
  .number({ invalid_type_error: 'current must be number' })
  .min(1, { message: 'current must be greater or equal to 1' });
const pageSizeQuerySchema = z
  .number({ invalid_type_error: 'page_size must be number' })
  .min(10, { message: 'page_size must be greater or equal to 10' })
  .max(100, { message: 'page_size must be less or equal to 100' });
const statusQuerySchema = z.enum(['PAID', 'CONFIRMED', 'PENDING'], {
  message: 'status must be PAID, CONFIRMED, or PENDING',
  invalid_type_error: 'status must be PAID, CONFIRMED, or PENDING',
});

export const listDriverSalaryQuerySchema = z
  .object({
    month: z
      .string({ required_error: 'month query required' })
      .nonempty({ message: 'month query required' }),
    year: z
      .string({ required_error: 'year query required' })
      .nonempty({ message: 'year query required' }),
    current: z.string().optional(),
    page_size: z.string().optional(),
    driver_code: z.string().optional(),
    status: z.string().optional(),
    name: z.string().optional(),
  })
  .optional();

export type ListDriverSalaryQuery = {
  month: number;
  year: number;
  current: number;
  page_size: number;
  driver_code?: string;
  status?: ShipmentCostCostStatus;
  name?: string;
};

type ValidationError = {
  month?: string[];
  year?: string[];
  current?: string[];
  page_size?: string[];
  driver_code?: string[];
  status?: string[];
  name?: string[];
};

export function validateListDriverSalaryQuery(query: unknown): {
  data?: ListDriverSalaryQuery;
  error?: ValidationError;
  success: boolean;
} {
  let success = true;
  let error: ValidationError = {};
  const parsedQuery = listDriverSalaryQuerySchema.safeParse(query);
  if (parsedQuery.error) {
    const formatedErr = parsedQuery.error.format();
    success = false;
    error.year = formatedErr.year?._errors;
    error.month = formatedErr.month?._errors;
  }

  if (parsedQuery.data) {
    let parsedQueryData: ListDriverSalaryQuery = {
      month: 0,
      year: 0,
      page_size: 10,
      current: 1,
    };
    // month
    const parsedMonthQuery = monthQuerySchema.safeParse(
      Number(parsedQuery.data.month),
    );
    if (parsedMonthQuery.error) {
      success = false;
      error.month = parsedMonthQuery.error.format()._errors;
    }
    if (parsedMonthQuery.data) {
      parsedQueryData.month = parsedMonthQuery.data;
    }

    // year
    const parsedYearQuery = yearQuerySchema.safeParse(
      Number(parsedQuery.data.year),
    );
    if (parsedYearQuery.error) {
      success = false;
      error.year = parsedYearQuery.error.format()._errors;
    }
    if (parsedYearQuery.data) {
      parsedQueryData.year = parsedYearQuery.data;
    }

    // page_size
    if (parsedQuery.data.page_size) {
      const parsedPageSizeQuery = pageSizeQuerySchema.safeParse(
        Number(parsedQuery.data.page_size),
      );
      if (parsedPageSizeQuery.error) {
        success = false;
        error.page_size = parsedPageSizeQuery.error.format()._errors;
      }
      if (parsedPageSizeQuery.data) {
        parsedQueryData.page_size = parsedPageSizeQuery.data;
      }
    }

    // current
    if (parsedQuery.data.current) {
      const parsedCurrentQuery = currentQuerySchema.safeParse(
        Number(parsedQuery.data.current),
      );
      if (parsedCurrentQuery.error) {
        success = false;
        error.current = parsedCurrentQuery.error.format()._errors;
      }
      if (parsedCurrentQuery.data) {
        parsedQueryData.current = parsedCurrentQuery.data;
      }
    }

    // driver_code
    if (parsedQuery.data.driver_code) {
      parsedQueryData.driver_code = parsedQuery.data.driver_code;
    }

    // status
    if (parsedQuery.data.status) {
      const parsedStatusQuery = statusQuerySchema.safeParse(
        parsedQuery.data.status,
      );

      if (parsedStatusQuery.error) {
        success = false;
        error.status = parsedStatusQuery.error.format()._errors;
      }
      if (parsedStatusQuery.data) {
        parsedQueryData.status = parsedStatusQuery.data;
      }
    }

    // name
    if (parsedQuery.data.name) {
      parsedQueryData.name = parsedQuery.data.name;
    }
    return {
      data: parsedQueryData,
      error: success ? undefined : error,
      success: success,
    };
  }
  return { error: error, success: success };
}
