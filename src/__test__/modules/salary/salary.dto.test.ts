import { ShipmentCostCostStatus } from '../../../db/schema';
import { validateListDriverSalaryQuery } from '../../../modules/salary/salary.dto';

describe('validateListDriverSalaryQuery', () => {
  it('should validate required fields correctly', () => {
    const result = validateListDriverSalaryQuery({});
    expect(result.success).toBe(false);
    expect(result.error).toHaveProperty('month');
    expect(result.error).toHaveProperty('year');
  });

  it('should return success with valid required query parameters', () => {
    const query = {
      month: '7',
      year: '2024',
    };

    const result = validateListDriverSalaryQuery(query);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      month: 7,
      year: 2024,
      current: 1,
      page_size: 10,
    });
  });

  it('should validate month constraints', () => {
    const invalidMonths = ['0', '13', '-1', 'abc'];

    invalidMonths.forEach((month) => {
      const result = validateListDriverSalaryQuery({
        month,
        year: '2024',
      });
      expect(result.success).toBe(false);
      expect(result.error?.month).toBeDefined();
    });
  });

  it('should validate year constraints', () => {
    const invalidYears = ['1999', '3001', '-2024', 'abc'];

    invalidYears.forEach((year) => {
      const result = validateListDriverSalaryQuery({
        month: '7',
        year,
      });
      expect(result.success).toBe(false);
      expect(result.error?.year).toBeDefined();
    });
  });

  it('should validate page_size constraints', () => {
    const invalidPageSizes = ['5', '150', '-10', 'abc'];

    invalidPageSizes.forEach((page_size) => {
      const result = validateListDriverSalaryQuery({
        month: '7',
        year: '2024',
        page_size,
      });
      expect(result.success).toBe(false);
      expect(result.error?.page_size).toBeDefined();
    });

    // Test valid page size
    const validResult = validateListDriverSalaryQuery({
      month: '7',
      year: '2024',
      page_size: '50',
    });
    expect(validResult.success).toBe(true);
    expect(validResult.data?.page_size).toBe(50);
  });

  it('should validate current page constraints', () => {
    const invalidCurrents = ['0', '-1', 'abc'];

    invalidCurrents.forEach((current) => {
      const result = validateListDriverSalaryQuery({
        month: '7',
        year: '2024',
        current,
      });
      expect(result.success).toBe(false);
      expect(result.error?.current).toBeDefined();
    });

    // Test valid current page
    const validResult = validateListDriverSalaryQuery({
      month: '7',
      year: '2024',
      current: '2',
    });
    expect(validResult.success).toBe(true);
    expect(validResult.data?.current).toBe(2);
  });

  it('should validate status enum values', () => {
    const invalidStatuses = ['UNKNOWN', 'DONE', 'abc'];

    invalidStatuses.forEach((status) => {
      const result = validateListDriverSalaryQuery({
        month: '7',
        year: '2024',
        status,
      });
      expect(result.success).toBe(false);
      expect(result.error?.status).toBeDefined();
    });

    // Test valid statuses
    const validStatuses: ShipmentCostCostStatus[] = [
      'PAID',
      'CONFIRMED',
      'PENDING',
    ];
    validStatuses.forEach((status) => {
      const result = validateListDriverSalaryQuery({
        month: '7',
        year: '2024',
        status,
      });
      expect(result.success).toBe(true);
      expect(result.data?.status).toBe(status);
    });
  });

  it('should handle optional fields correctly', () => {
    const result = validateListDriverSalaryQuery({
      month: '7',
      year: '2024',
      driver_code: 'DRV123',
      name: 'John Doe',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      month: 7,
      year: 2024,
      current: 1,
      page_size: 10,
      driver_code: 'DRV123',
      name: 'John Doe',
    });
  });

  it('should handle all fields with valid values', () => {
    const result = validateListDriverSalaryQuery({
      month: '7',
      year: '2024',
      current: '2',
      page_size: '50',
      driver_code: 'DRV123',
      status: 'PAID',
      name: 'John Doe',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      month: 7,
      year: 2024,
      current: 2,
      page_size: 50,
      driver_code: 'DRV123',
      status: 'PAID',
      name: 'John Doe',
    });
  });

  it('should handle invalid query type', () => {
    const result = validateListDriverSalaryQuery(null);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
