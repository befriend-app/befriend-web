require('../services/shared');
loadScriptEnv();

let db = require('../services/db');


(async function() {
    let conn = await db.conn();

    //process prev waitlist users
    let waitlist_users = await conn('waitlist')
        .whereNull('metro_city');

    for(let user of waitlist_users) {
        let closest_metro = await getClosestMetroByIp(user.ip_address);

        if(closest_metro) {
            await conn('waitlist')
                .where('id', user.id)
                .update({
                    metro_city: closest_metro.metro_name
                });
        } else {
            console.log({
                metro_too_far: user
            });
        }
    }

    //update counts
    let waitlist_metros = await conn('waitlist')
        .whereNotNull('metro_city');

    let metro_dict = {};

    for(let user of waitlist_metros) {
        if(!(user.metro_city in metro_dict)) {
            metro_dict[user.metro_city] = 0;
        }

        metro_dict[user.metro_city]++;
    }

    console.log(metro_dict);

    for(let metro_name in metro_dict) {
        let metro_count = metro_dict[metro_name];

        await conn('metros')
            .where('metro_name', metro_name)
            .update({
                metro_count: metro_count,
                updated: getLocalDate()
            });
    }

    process.exit();
})();