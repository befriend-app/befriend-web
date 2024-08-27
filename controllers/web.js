let dbService = require('../services/db');

module.exports = {
    getHome: function (req, res) {
        return new Promise(async (resolve, reject) => {
            let count;

            try {
                let conn = await dbService.conn();

                count = await conn('waitlist');
                count = count.length;
            } catch(e) {

            }

            res.render('pages/home', {
                title: `Welcome | Befriend`,
                count: count
            });

            resolve();
        });
    },
    getMap: function (req, res) {
        return new Promise(async (resolve, reject) => {
            let metros;

            try {
                let conn = await dbService.conn();

                metros = await conn('metros')
                    .where('metro_count', '>', 0)
                    .select(
                        'metro_name', 'metro_emoji',
                        'metro_count', 'lat', 'lon'
                    );
            } catch(e) {
                console.error(e);
            }

            res.render('partials/map', {
                layout: false,
                title: `Map`,
                metros: metros
            });

            resolve();
        });
    },

}
