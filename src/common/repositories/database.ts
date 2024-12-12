import { Kysely } from 'kysely';
import { Database } from '../../db/schema';

export class DatabaseRepository {
  constructor(readonly db: Kysely<Database>) {}
}
