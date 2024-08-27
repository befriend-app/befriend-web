require('../services/shared');
loadScriptEnv();

let db = require('../services/db');

(async function() {
    let conn = await db.conn();

    let metro_data = await getReadFile(joinPaths(getRepoRoot(), 'data/metro-areas.json'), true);

    for(let city in metro_data) {
        let data = metro_data[city];

        let check = await conn('metros')
            .where('metro_name', city)
            .first();

        if(!check) {
            await conn('metros')
                .insert({
                    metro_name: city,
                    metro_count: 0,
                    lat: data[0],
                    lon: data[1],
                    created: getLocalDate(),
                    updated: getLocalDate()
                });
        }
    }

    process.exit();
})();