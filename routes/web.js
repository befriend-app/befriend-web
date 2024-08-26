let express = require('express');
let router = express.Router();

let webController = require('../controllers/web');


router.get('/', function (req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            await webController.getHome(req, res);
        } catch (e) {
            return res.json("Error loading page", 400);
        }

        resolve();
    });
});

router.get('/discord', function (req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            res.redirect(`https://discord.gg/mXndW6TT`);
        } catch (e) {
            return res.json("Error loading page", 400);
        }

        resolve();
    });
});


module.exports = router;
