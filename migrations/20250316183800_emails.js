/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('email_campaigns', function(table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.integer('created');
        })
        .createTable('email_sends', function(table) {
            table.increments('id').primary();
            table.integer('campaign_id').unsigned().references('id').inTable('email_campaigns');
            table.integer('user_id').unsigned().references('id').inTable('waitlist');
            table.integer('created');
            table.integer('updated');
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('email_sends')
        .dropTableIfExists('email_campaigns')
};