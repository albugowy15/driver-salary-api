import { AppInstance } from '../../types';
import { validateListDriverSalaryQuery } from './salary.dto';
import { SalaryRepositoryImpl } from './salary.repository';
import { SalaryServiceImpl } from './salary.service';

export async function salaryRoutes(app: AppInstance) {
  const salaryRepository = new SalaryRepositoryImpl(app.db);
  const salaryService = new SalaryServiceImpl(salaryRepository);

  app.get('/v1/salary/driver/list', async (request, reply) => {
    const validateQueryResult = validateListDriverSalaryQuery(request.query);
    if (validateQueryResult.error) {
      reply.status(400).send({
        validation_errors: validateQueryResult.error,
      });
      return;
    }
    if (validateQueryResult.data) {
      const result = await salaryService.filterDriverSalary(
        validateQueryResult.data,
      );
      reply.status(200).send({
        success: true,
        data: result.data,
        total_row: result.total_row,
        current: validateQueryResult.data.current,
        page_size: validateQueryResult.data.page_size,
      });
      return;
    }
    reply.status(400).send({
      message: 'Invalid Request',
    });
  });
}
