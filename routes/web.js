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

router.post('/waitlist', function (req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            await webController.postWaitlist(req, res);
        } catch (e) {
            return res.json("Error", 400);
        }

        resolve();
    });
});

module.exports = router;
