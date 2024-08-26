const fs = require("fs");
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc);
dayjs.extend(timezone);

global.serverTimezoneString = 'America/Chicago';

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

global.normalizePort = function (val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


global.formatNumberLength = function(num, length) {
    var r = "" + num;

    while (r.length < length) {
        r = "0" + r;
    }
    return r;
};

global.joinPaths = function() {
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i] + '';
        if(!arg) {
            continue;
        }

        if(typeof arg === 'number') {
            arg = arg.toString();
        }

        args.push(arg);
    }

    var slash = '/';

    if(process.platform === 'win32' && args[0].includes('\\')) {
        slash = '\\';
    }

    let url = args.map((part, i) => {
        if (i === 0) {
            var re = new RegExp(`[\\${slash}]*$`, 'g');
            return part.trim().replace(re, '')
        } else {
            var re = new RegExp(`(^[\\${slash}]*|[\\/]*$)`, 'g');
            return part.trim().replace(re, '')
        }
    }).filter(x=>x.length).join(slash);

    if(!url.startsWith('http') && !url.startsWith('/')) {
        url = `/${url}`;
    }

    return url;
};

global.getChicagoDate = function () {
    return getLocalDateStr(changeTimezone(new Date(), serverTimezoneString));
}

global.numberWithCommas = function (x, to_integer) {
    if(!x) {
        return x;
    }

    if(to_integer) {
        x = Number.parseInt(x);
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

global.timeNow = function (ms) {
    if(ms) {
        return Date.now();
    }

    return Number.parseInt(Date.now() / 1000);
}

global.dateTimeNow = function (date) {
    if(!date) {
        date = new Date();
    }

    return date.toISOString().slice(0,10) + ' ' + date.toISOString().substring(11, 19);
}

global.getDateTimeStr = function () {
    var date = new Date();
    return date.toISOString().slice(0, 10) + ' ' + date.toISOString().substring(11, 19);
}

global.getLocalDateTimeStr = function (date) {
    if(!date) {
        date = new Date();
    }

    let dayjs = require('dayjs');

    dayjs = dayjs(date);

    return dayjs.format('MM-DD-YY HH:mm:ss');
}

global.getLocalDateStr = function (date) {
    if(!date) {
        date = new Date();
    }

    const offset = date.getTimezoneOffset()
    const offsetAbs = Math.abs(offset)
    const isoString = new Date(date.getTime() - offset * 60 * 1000).toISOString()
    let str = `${isoString.slice(0, -1)}${offset > 0 ? '-' : '+'}${String(Math.floor(offsetAbs / 60)).padStart(2, '0')}:${String(offsetAbs % 60).padStart(2, '0')}`;
    str = str.replace('T', ' ').substring(0, 19);
    return str;
};

global.getDateStr= function (date) {
    let dayjs = require('dayjs');
    let obj = dayjs(date);
    return obj.format('YYYY-MM-DD');
};

global.getDateDiff= function (date_1, date_2, unit) {
    let dayjs = require('dayjs');

    date_1 = dayjs(date_1);
    date_2 = dayjs(date_2);

    return date_1.diff(date_2, unit);
};

global.getStatesList = function () {
    return {
        'AL':"Alabama",
        'AK':"Alaska",
        'AZ':"Arizona",
        'AR':"Arkansas",
        'CA':"California",
        'CO':"Colorado",
        'CT':"Connecticut",
        'DE':"Delaware",
        'DC':"District Of Columbia",
        'FL':"Florida",
        'GA':"Georgia",
        'HI':"Hawaii",
        'ID':"Idaho",
        'IL':"Illinois",
        'IN':"Indiana",
        'IA':"Iowa",
        'KS':"Kansas",
        'KY':"Kentucky",
        'LA':"Louisiana",
        'ME':"Maine",
        'MD':"Maryland",
        'MA':"Massachusetts",
        'MI':"Michigan",
        'MN':"Minnesota",
        'MS':"Mississippi",
        'MO':"Missouri",
        'MT':"Montana",
        'NE':"Nebraska",
        'NV':"Nevada",
        'NH':"New Hampshire",
        'NJ':"New Jersey",
        'NM':"New Mexico",
        'NY':"New York",
        'NC':"North Carolina",
        'ND':"North Dakota",
        'OH':"Ohio",
        'OK':"Oklahoma",
        'OR':"Oregon",
        'PA':"Pennsylvania",
        'PR':"Puerto Rico",
        'RI':"Rhode Island",
        'SC':"South Carolina",
        'SD':"South Dakota",
        'TN':"Tennessee",
        'TX':"Texas",
        'UT':"Utah",
        'VT':"Vermont",
        'VA':"Virginia",
        'WA':"Washington",
        'WV':"West Virginia",
        'WI':"Wisconsin",
        'WY':"Wyoming"
    }
};

global.getCityState = function (zip, blnUSA = true) {
    return new Promise(async (resolve, reject) => {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?components=country:US|postal_code:${zip}&key=${process.env.GMAPS_KEY}`;

        let axios = require('axios');

        try {
            var address_info = await axios.get(url);
        } catch(e) {
            return reject(e);
        }

        let city = "";
        let state = "";
        let country = "";

        var data = address_info.data;

        if(data.results && data.results.length) {
            for(let component of data.results[0].address_components) {
                let type = component.types[0];

                if(city === "" && (type === 'sublocality_level_1') || type === 'locality') {
                    city = component.short_name.trim();
                }

                if(state === "" && type === 'administrative_area_level_1') {
                    state = component.short_name.trim();
                }

                if(country === '' && type === 'country') {
                    country = component.short_name.trim();

                    if(blnUSA && country !== 'US') {
                        city = "";
                        state = "";
                        break;
                    }
                }

                if(city && state && country) {
                    break;
                }
            }
        }

        return resolve({
            city: city,
            state: state,
            zip: zip,
            country: country
        })
    });
}

global.timeoutAwait = function (ms, f) {
    return new Promise(async (resolve, reject) => {
        setTimeout(function () {
            if(f) {
                f();
            }

            resolve();
        }, ms);
    });
}

global.shuffleFunc = function (array){
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

global.changeTimezone = function (date, ianatz) {
    var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: ianatz
    }));

    var diff = date.getTime() - invdate.getTime();

    return new Date(date.getTime() - diff);
}

global.isValidEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

global.isValidUserName = function (username) {
    const valid = /^[a-z0-9_\.]+$/.exec(username);
    return valid;
}

global.getRepoRoot = function () {
    let slash = `/`;

    if(process.platform.startsWith('win')) {
        slash = `\\`;
    }

    let path_split = __dirname.split(slash);

    let path_split_slice = path_split.slice(0, path_split.length - 1);

    return path_split_slice.join(slash);
};


global.isLocalApp = function () {
    return process.env.APP_ENV.includes('local');
};

global.isProdApp = function () {
    return process.env.APP_ENV && process.env.APP_ENV.includes('prod');
};

global.execCmd = function(cmd, ret_data, log_data) {
    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');

        exec(cmd, {maxBuffer: 1024 * 1024 * 20}, (err, stdout, stderr) => {
            if (err) {
                //some err occurred
                console.error(err);
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}

global.createDirectoryIfNotExistsRecursive = function (dirname) {
    return new Promise(async (resolve, reject) => {
        var slash = '/';

        let directories_backwards = [dirname];
        let minimize_dir = dirname;
        let directories_needed = [];
        let directories_forwards = [];

        while (minimize_dir = minimize_dir.substring(0, minimize_dir.lastIndexOf(slash))) {
            directories_backwards.push(minimize_dir);
        }

        const fs = require('fs');

        //stop on first directory found
        for(const d in directories_backwards) {
            if(!(fs.existsSync(directories_backwards[d]))) {
                directories_needed.push(directories_backwards[d]);
            } else {
                break;
            }
        }

        //no directories missing
        if(!directories_needed.length) {
            return resolve();
        }

        // make all directories in ascending order
        directories_forwards = directories_needed.reverse();

        for(const d in directories_forwards) {
            try {
                fs.mkdirSync(directories_forwards[d]);
            } catch(e) {
            }
        }

        resolve();
    });
}

global.getReadFile = function(p, json) {
    return new Promise((resolve, reject) => {
        require('fs').readFile(p, function (err, data) {
            if(err) {
                return reject(err);
            }

            if(data) {
                data = data.toString();
            }

            if(json) {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    return reject(e);
                }
            }

            return resolve(data);
        });
    })
}

global.writeFile = function (file_path, data) {
    return new Promise(async (resolve, reject) => {
        const fs = require('fs');

        fs.writeFile(file_path, data, (err) => {
            if (err) {
                console.error(err);
                return reject(err);
            } else {
                resolve();
            }
        });
    });
}

global.getIPAddr = function (req) {
    return req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    null;
}

global.slugName = function (name) {
    return require('slugify')(name, {
        lower: true,
        strict: true
    });
}

global.downloadURL = function (url, output_path) {
    return new Promise(async (resolve, reject) => {
        let axios = require('axios');

        try {
            let response = await axios({
                method: "get",
                url: url,
                responseType: "stream",
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });

            let w = fs.createWriteStream(output_path);

            response.data.pipe(w);

            w.on('finish', function () {
                resolve();
            });
        } catch(e) {
            console.error(e);
            return reject(e);
        }

    });
}

global.getSessionKey = function(session) {
    return `session:web:${session}`;
}

global.cloneObj = function (obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch(e) {
        console.error(e);
        return null;
    }
}

global.deleteFile = function (file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file, function (err, ok) {
            if(err) {
                return reject();
            }

            resolve();
        });
    });
}

global.generateToken = function (length) {
    if(!length) {
        length = 32;
    }

    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    var b = [];

    for (var i= 0; i < length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }

    return b.join("");
}

global.isNumeric = function (val) {
    return !isNaN( parseFloat(val) ) && isFinite( val );
}

global.listFilesDir = function(dir) {
    return new Promise(async (resolve, reject) => {
        let fs = require('fs');

        try {
            let exists = await checkIfPathExists(dir);
            if(!exists) {
                return resolve([]);
            }
        } catch (e) {
            return reject(e);
        }

        fs.readdir(dir, function (err, filesData) {
            //handling error
            if (err) {
                return reject(err);
            }

            resolve(filesData);
        });
    });
};

global.checkIfPathExists = function(p) {
    return new Promise((resolve, reject) => {
        require('fs').exists(p, function (exists) {
            let bool = exists ? true : false;
            return resolve(bool);
        });
    });
}

global.loadScriptEnv = function () {
    let repo_root = getRepoRoot();

    const process = require('process');
    process.chdir(repo_root);

    require('dotenv').config();
}


module.exports = {
    sendEmail(subject, html, email, from, cc, attachment_alt) {
        return new Promise(async(resolve, reject) => {
            if(!from) {
                from = process.env.EMAIL_FROM;
            }

            const sgMail = require('@sendgrid/mail');

            sgMail.setApiKey(process.env.SENDGRID_KEY);

            let sendMsg = {
                trackingSettings: {
                    clickTracking: {
                        enable: false,
                        enableText: false
                    }
                },
                to: email,
                from: from,
                subject: subject,
                html: html
            };

            try {
                await sgMail.send(sendMsg);
            } catch(e) {
                console.error(e);
                return reject(e);
            }

            if(cc) {
                try {
                    let cc_message = sendMsg;
                    cc_message.to = process.env.EMAIL_FROM;
                    await sgMail.send(cc_message);
                } catch(e) {
                    console.error(e);
                }
            }

            return resolve();
        });
    },
};
