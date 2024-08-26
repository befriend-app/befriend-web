#!/usr/bin/env node

require('dotenv').config();

require('./services/shared');

let cacheService = require('./services/cache');
let serverService = require('./services/server');
let stylesService = require('./services/styles');

(async function() {
    try {
        await cacheService.init();
    } catch(e) {
        console.error(e);
    }

    try {
        await stylesService.init();
    } catch(e) {
        console.error(e);
    }

    try {
        await serverService.init();
    } catch(e) {
        console.error(e);
    }
})();