exports.up = function(knex) {
    return knex.schema
        .createTable('waitlist', function (table) {
            table.bigIncrements('id');
            table.string('email', 191).unique().notNullable();
            table.string('user_name', 255).nullable();
            table.string('user_code', 191).notNullable();
            table.string('ip_address', 191).notNullable();
            table.string('ip_location', 255).nullable();
            table.string('metro_city', 255).nullable();
            table.boolean('is_confirmed').defaultTo(0);
            table.boolean('unsubscribed').defaultTo(0);
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        })
        .createTable('metros', function (table) {
            table.increments('id');

            table.string('metro_name', 300).nullable();
            table.string('metro_emoji', 100).nullable();
            table.integer('metro_count').defaultTo(0);
            table.float('lat', 14,10).nullable();
            table.float('lon', 14,10).nullable();

            table.timestamp('created').nullable();
            table.timestamp('updated').nullable();
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('users_payments')
        .dropTable('payment_methods');
};
