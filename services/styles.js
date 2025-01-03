module.exports = {
    init: function () {
        return new Promise(async (resolve, reject) => {
            let serverApp = require('./server').app;

            let styles_organized = {};

            let variables_str = await getReadFile(joinPaths(getRepoRoot(), 'resources/scss/_variables.scss'));

            let variables_lines = variables_str.split('\n');

            for(let l of variables_lines) {
                if(l[0] === '$') {
                    let l_split = l.split(':');

                    l_split[1] = l_split[1].trimStart();

                    styles_organized[l_split[0].replace('$', '')] = l_split[1].replace(';', '');
                }
            }


            serverApp.locals.webStyles = styles_organized;

            resolve();
        });
    }
};
