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
    }
}
