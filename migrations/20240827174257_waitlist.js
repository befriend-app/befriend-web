exports.up = function(knex) {
    return knex.schema
        .createTable('waitlist', function (table) {
            table.bigIncrements('id');
            table.string('email', 191).unique().notNullable();
            table.string('user_name', 255).nullable();
            table.string('user_code', 191).notNullable();
            table.string('ip_address', 255).nullable();
            table.string('ip_location', 255).nullable();
            table.boolean('is_confirmed').defaultTo(0);
            table.boolean('unsubscribed').defaultTo(0);
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('waitlist');
};
