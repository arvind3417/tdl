import { Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('journals', (table) => {
    table.increments('id').primary();
    table.integer('teacher_id').unsigned().references('users.id').notNullable();
    table.text('description').notNullable();
    table.specificType('tagged_students', 'integer[]').notNullable();
    table.timestamp('published_at').notNullable();
    table.string('attachment_type', 20).notNullable();
    table.text('attachment_url');
    table.timestamps(true, true);
  });
  console.log('journals table created');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('journals');
  console.log('journals table dropped');
}
