let express = require('express');
let router = express.Router();

let webController = require('../controllers/web');
const ejs = require("ejs");

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

router.get('/non-profit', function (req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            await webController.getNonProfit(req, res);
        } catch (e) {
            return res.json("Error loading page", 400);
        }

        resolve();
    });
});

router.get('/preview', function (req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            await webController.getPreview(req, res);
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

router.get('/waitlist/confirm', function (req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            await webController.getConfirm(req, res);
        } catch (e) {
            return res.json("Error loading page", 400);
        }

        resolve();
    });
});

router.get('/email/unsubscribe/:user_code', function (req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            await webController.getUnsubscribe(req, res);
        } catch (e) {
            return res.json("Error loading page", 400);
        }

        resolve();
    });
});

router.get('/test', function (req, res, next) {
    return new Promise(async (resolve, reject) => {
        try {
            let view_path = joinPaths(getRepoRoot(), `tmp/email/views/preview.ejs`);

            let html = await ejs.renderFile(view_path, {
                user_code: 123,
            });

            res.send(html);
        } catch (e) {
            console.error(e);
        }

        resolve();
    });
});


module.exports = router;
