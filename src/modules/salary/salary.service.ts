import { InternalServerError } from '../../utils/error';
import { ListDriverSalaryQuery } from './salary.dto';
import { FilterDriverSalaryRow, SalaryRepository } from './salary.repository';

interface FilterDriverSalaryResponse {
  data: FilterDriverSalaryRow[];
  total_row: number;
  current: number;
  page_size: number;
}

export interface SalaryService {
  filterDriverSalary(
    query: ListDriverSalaryQuery,
  ): Promise<FilterDriverSalaryResponse>;
}

export class SalaryServiceImpl implements SalaryService {
  constructor(private readonly salaryRepository: SalaryRepository) {}

  async filterDriverSalary(
    query: ListDriverSalaryQuery,
  ): Promise<FilterDriverSalaryResponse> {
    try {
      const result = await this.salaryRepository.filterDriverSalary(query);
      return {
        data: result.data,
        total_row: result.total_rows,
        current: query.current,
        page_size: query.page_size,
      };
    } catch (err) {
      throw new InternalServerError('Unknown error');
    }
  }
}
