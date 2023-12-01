import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.decimal('price').defaultTo(0);
    table.string('image_url').notNullable();
    table.decimal('stock').defaultTo(0);
    table.integer('categories_id').unsigned();
    table
      .foreign('categories_id')
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL');
    table.text('description');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('products');
}
