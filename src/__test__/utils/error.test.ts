import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../../utils/error';

describe('Custom Error Classes', () => {
  describe('AppError', () => {
    it('should create an AppError instance with correct properties', () => {
      const httpCode = 418;
      const message = 'I am a teapot';
      const error = 'Cannot brew coffee';

      const appError = new AppError(httpCode, message, error);

      expect(appError).toBeInstanceOf(Error);
      expect(appError).toBeInstanceOf(AppError);
      expect(appError.httpCode).toBe(httpCode);
      expect(appError.message).toBe(message);
      expect(appError.error).toBe(error);
    });

    it('should preserve stack trace', () => {
      const appError = new AppError(500, 'Test Error', 'Error details');
      expect(appError.stack).toBeDefined();
    });
  });

  describe('BadRequestError', () => {
    it('should create a BadRequestError instance with correct properties', () => {
      const errorMessage = 'Invalid input parameters';
      const error = new BadRequestError(errorMessage);

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.httpCode).toBe(400);
      expect(error.message).toBe('Invalid Request');
      expect(error.error).toBe(errorMessage);
    });

    it('should allow empty error message', () => {
      const error = new BadRequestError('');

      expect(error.httpCode).toBe(400);
      expect(error.message).toBe('Invalid Request');
      expect(error.error).toBe('');
    });
  });

  describe('InternalServerError', () => {
    it('should create an InternalServerError instance with correct properties', () => {
      const errorMessage = 'Database connection failed';
      const error = new InternalServerError(errorMessage);

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(InternalServerError);
      expect(error.httpCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
      expect(error.error).toBe(errorMessage);
    });

    it('should allow empty error message', () => {
      const error = new InternalServerError('');

      expect(error.httpCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
      expect(error.error).toBe('');
    });
  });

  describe('NotFoundError', () => {
    it('should create a NotFoundError instance with correct properties', () => {
      const errorMessage = 'Resource not found';
      const error = new NotFoundError(errorMessage);

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.httpCode).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.error).toBe(errorMessage);
    });

    it('should allow empty error message', () => {
      const error = new NotFoundError('');

      expect(error.httpCode).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.error).toBe('');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create an UnauthorizedError instance with correct properties', () => {
      const errorMessage = 'Access denied';
      const error = new UnauthorizedError(errorMessage);

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.httpCode).toBe(403);
      expect(error.message).toBe('Unauthorized');
      expect(error.error).toBe(errorMessage);
    });

    it('should allow empty error message', () => {
      const error = new UnauthorizedError('');

      expect(error.httpCode).toBe(403);
      expect(error.message).toBe('Unauthorized');
      expect(error.error).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should be catchable as Error', () => {
      expect(() => {
        throw new BadRequestError('Test error');
      }).toThrow(Error);
    });

    it('should be catchable as AppError', () => {
      expect(() => {
        throw new BadRequestError('Test error');
      }).toThrow(AppError);
    });

    it('should preserve instanceof checks in catch blocks', () => {
      try {
        throw new BadRequestError('Test error');
      } catch (error) {
        expect(error instanceof AppError).toBe(true);
        expect(error instanceof BadRequestError).toBe(true);
      }
    });

    it('should maintain error properties when caught', () => {
      try {
        throw new NotFoundError('Resource not found');
      } catch (error) {
        if (error instanceof NotFoundError) {
          expect(error.httpCode).toBe(404);
          expect(error.message).toBe('Not Found');
          expect(error.error).toBe('Resource not found');
        }
      }
    });
  });
});
