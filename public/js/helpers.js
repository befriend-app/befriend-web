let click_handler = 'click';

let mouse_memory = {
    target: {
        up: null,
        down: null
    }
};

//dvh polyfill
function setVh () {
    if ("CSS" in window && "supports" in window.CSS && window.CSS.supports("height: 100svh") && window.CSS.supports("height: 100dvh") && window.CSS.supports("height: 100lvh")) {
        return;
    }

    let isMobile = function () {
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2)) {
            return true;
        }
        return false;
    };

    if (!isMobile()) {
        return;
    }

    let svh = document.documentElement.clientHeight * 0.01;
    document.documentElement.style.setProperty("--1svh", svh + "px");
    let dvh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--1dvh", dvh + "px");

    if (document.body) {
        let fixed = document.createElement("div");
        fixed.style.width = "1px";
        fixed.style.height = "100vh";
        fixed.style.position = "fixed";
        fixed.style.left = "0";
        fixed.style.top = "0";
        fixed.style.bottom = "0";
        fixed.style.visibility = "hidden";
        document.body.appendChild(fixed);
        let fixedHeight = fixed.clientHeight;
        fixed.remove();
        let lvh = fixedHeight * 0.01;
        document.documentElement.style.setProperty("--1lvh", lvh + "px");
    }
}

function capitalize (s) {
    if (typeof s !== 'string') {
        return '';
    }

    return s.charAt(0).toUpperCase() + s.slice(1)
}

function isTouchDevice() {
    let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

    let mq = function(query) {
        return window.matchMedia(query).matches;
    };

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');

    return mq(query);
}

function addClassEl(name, el) {
    if(typeof el !== 'object') {
        el = document.getElementById(el);
    }

    if(!el) {
        return;
    }

    if(!el.classList.contains(name)) {
        el.classList.add(name);
    }
}

function removeClassEl(name, el) {
    if(typeof el !== 'object') {
        el = document.getElementById(el);
    }

    if(!el) {
        return;
    }

    if(el.classList.contains(name)) {
        el.classList.remove(name);
    }
}

function elHasClass(el, cl) {
    if(!el) {
        return false;
    }

    if(typeof el === 'string') {
        el = document.getElementById(el);
    }

    if(!el) {
        return false;
    }

    return el.classList.contains(cl);
}

function timeoutAwait(t, f) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if(f) {
                f();
            }

            resolve();
        }, t);
    });
}

function rafAwait(f) {
    return new Promise((resolve, reject) => {
        requestAnimationFrame(async function () {
            if(f) {
                try {
                    await f();
                } catch (e) {
                }
            }

            resolve();
        });
    });
}

function fireClick(node){
    if(typeof node === 'string') {
        node = document.getElementById(node);
    }

    if(!node) {
        return;
    }

    if (document.createEvent) {
        let evt = document.createEvent('MouseEvents');
        evt.initEvent(click_handler, true, false);
        node.dispatchEvent(evt);
    } else if (document.createEventObject) {
        node.fireEvent(`on${click_handler}`) ;
    } else if (typeof node[`on${click_handler}`] == 'function') {
        node[`on${click_handler}`]();
    }
}

function toggleClassEl(name, el) {
    if(typeof el !== 'object') {
        el = document.getElementById(el);
    }

    if(!el) {
        return;
    }

    if(!el.classList.contains(name)) {
        el.classList.add(name);
    } else {
        el.classList.remove(name);
    }
}



function hasString(str) {
    return typeof str === 'string' && str.length > 0;
}

function onMouseUp(e) {
    mouse_memory.target.up = e.target;
}

function onMouseDown(e) {
    mouse_memory.target.down = e.target;
}

function createEl(type, id, class_list) {
    let el = document.createElement(type);

    if(id) {
        el.setAttribute("id", id);
    }

    if(class_list) {
        if(Array.isArray(class_list)) {
            for(let i = 0 ; i < class_list.length; i++) {
                if(class_list[i]) {
                    el.classList.add(class_list[i]);
                }
            }
        } else {
            if(class_list) {
                el.classList.add(class_list);
            }

        }
    }

    return el;
}

function removeArrItem(arr, item) {
    let index = arr.indexOf(item);

    if(index > -1) {
        arr.splice(index, 1);
    }
}

function formatNumberLength(num, length) {
    let r = "" + num;

    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function isValidEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function getErrorMessage(err) {
    let msg = null;

    if(err) {
        if(err.response) {
            if(err.response.data) {
                if(err.response.data.error) {
                    if(err.response.data.error.message) {
                        msg = err.response.data.error.message;
                    } else {
                        msg = err.response.data.error;
                    }
                } else if(err.response.data.message) {
                    msg = err.response.data.message;
                } else {
                    msg = err.response.data;
                }
            }
        }
    }

    if(msg && Array.isArray(msg)) {
        msg = msg.join(', ');
    }

    return msg;
}

function numberWithCommas(x, to_integer) {
    if(to_integer) {
        x = Number.parseInt(x);
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getOrdinalNum (number){
    let selector;

    if (number <= 0) {
        selector = 4;
    } else if ((number > 3 && number < 21) || number % 10 > 3) {
        selector = 0;
    } else {
        selector = number % 10;
    }

    return number + ['th', 'st', 'nd', 'rd', ''][selector];
};

function humanMonthFromNumber(month, shorten) {
    month = Number.parseInt(month);

    if(!month) {
        return '';
    }

    let human_month;

    if(month === 1) {
        human_month = 'January';
    } else if(month === 2) {
        human_month = 'February';
    } else if(month === 3) {
        human_month = 'March';
    } else if (month === 4) {
        human_month = 'April';
    } else if(month === 5) {
        human_month = 'May';
    } else if(month === 6) {
        human_month = 'June';
    } else if(month === 7) {
        human_month = 'July'
    } else if(month === 8) {
        human_month = 'August'
    } else if(month === 9) {
        human_month = 'September'
    } else if(month === 10) {
        human_month = 'October'
    } else if(month === 11) {
        human_month = 'November'
    } else if(month === 12) {
        human_month = 'December'
    }

    if(shorten) {
        return human_month.substring(0, 3);
    }

    return human_month;
}

function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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

function formatLargeNumber(num) {
    if(num < 10000) {
        return num;
    }

    if(num < 1000 * 1000) {
        let v = (num / 1000).toFixed(1);

        if(v.split('.')[1] == '0') {
            return (num / 1000).toFixed(0) + 'K';
        }

        return (num / 1000).toFixed(1) + 'K';
    }

    if(num < 1000 * 1000 * 1000) {
        let v = (num / 1000 / 1000).toFixed(1);

        if(v.split('.')[1] == '0') {
            return (num / 1000 / 1000).toFixed(0) + 'M';
        }

        return (num / 1000 / 1000).toFixed(1) + 'M';
    }
}

function changeElClass(el, cl, bool) {
    if(bool) {
        addClassEl(cl, el);
    } else {
        removeClassEl(cl, el);
    }
}

function isNumeric(obj) {
    return !isNaN( parseFloat(obj) ) && isFinite( obj );
}

function removeClassEls(cl, els) {
    let elements = [].slice.call(els);

    for(let i = 0; i < elements.length; i++) {
        elements[i].classList.remove(cl);
    }
}

function timeNow(ms) {
    if(ms) {
        return Date.now();
    }

    return Number.parseInt(Date.now() / 1000);
}

function generateToken(length) {
    if(!length) {
        length = 16;
    }

    //edit the token allowed characters
    let a = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    let b = [];

    for (let i= 0; i < length; i++) {
        let j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }

    return b.join("");
}

function getSession() {
    try {
        return parseCookies().SESSION;
    } catch(e) {
        null;
    }
}

function parseCookies() {
    let cookies = document.cookie;

    let cookies_split = cookies.split(';');

    let obj = {};

    for(let c of cookies_split) {
        let s = c.split('=');

        obj[s[0].trimStart().trimEnd()] = s[1].trimStart().trimEnd();
    }

    return obj;
}

function getLowestFraction(x0) {
    let eps = 1.0E-15;
    let h, h1, h2, k, k1, k2, a, x;

    x = x0;
    a = Math.floor(x);
    h1 = 1;
    k1 = 0;
    h = a;
    k = 1;

    while (x-a > eps*k*k) {
        x = 1/(x-a);
        a = Math.floor(x);
        h2 = h1; h1 = h;
        k2 = k1; k1 = k;
        h = h2 + a*h1;
        k = k2 + a*k1;
    }

    return {
        x: h,
        y: k
    }
}

function getClientX(e) {
    if(e.touches && e.touches.length) {
        return e.touches[0].clientX;
    }

    return e.clientX;
}

function getClientY(e) {
    if(e.touches && e.touches.length) {
        return e.touches[0].clientY;
    }

    return e.clientY;
}

function cloneObj (obj) {
    if(!obj) {
        return obj;
    }

    try {
        return JSON.parse(JSON.stringify(obj));
    } catch(e) {
        console.error(e);
        return null;
    }
}

function getStatesList() {
    return {
        "AL": "Alabama",
        "AK": "Alaska",
        // "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District Of Columbia",
        // "FM": "Federated States Of Micronesia",
        "FL": "Florida",
        "GA": "Georgia",
        // "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        // "MH": "Marshall Islands",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        // "MP": "Northern Mariana Islands",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        // "PW": "Palau",
        "PA": "Pennsylvania",
        "PR": "Puerto Rico",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        // "VI": "Virgin Islands",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    }
}

function joinPaths () {
    let args = [];

    for (let i = 0; i < arguments.length; i++) {
        let arg = arguments[i] + '';
        if(!arg) {
            continue;
        }

        if(typeof arg === 'number') {
            arg = arg.toString();
        }

        args.push(arg);
    }

    let slash = '/';

    return args.map((part, i) => {
        if (i === 0) {
            let re = new RegExp(`[\\${slash}]*$`, 'g');
            return part.trim().replace(re, '')
        } else {
            let re = new RegExp(`(^[\\${slash}]*|[\\/]*$)`, 'g');
            return part.trim().replace(re, '')
        }
    }).filter(x=>x.length).join(slash)
}

function parseParams(query) {
    if(!query) {
        query = location.search;
    }

    let obj = {};

    if(query) {
        query = query.substring(1);

        let split_1 = query.split('&');

        for(let s of split_1) {
            let split_2 = s.split('=');
            obj[split_2[0]] = split_2[1];
        }
    }

    if(Object.keys(obj).length) {
        return obj;
    }

    return null;
}

function makeElHidden(el) {
    //prevent element from being visible
    el.style.visibility = 'hidden';

    //prevent layout from moving
    el.style.position = 'absolute';
}

function getFontSize(el) {
    return getComputedStyle(el).fontSize;
}

function getTextDims(el, fontSize) {
    if(!el.innerHTML) {
        return;
    }

    let canvas = document.createElement('canvas');

    makeElHidden(canvas);

    document.body.appendChild(canvas);

    let ctx = canvas.getContext('2d', { willReadFrequently: true });

    if(!fontSize) {
        fontSize = getFontSize(el);
    }

    ctx.font = `${fontSize} ${webStyles.font_family}`;

    ctx.textBaseline = "top";
    ctx.fillText(el.innerHTML, 0, 0);

    // Remove the surrounding transparent pixels
    // result is an actual canvas element
    let result = trim(canvas);

    // Trim Canvas Pixels Method
    // https://gist.github.com/remy/784508
    function trim(c) {

        let ctx = c.getContext('2d'),

            // create a temporary canvas in which we will draw back the trimmed text
            copy = document.createElement('canvas').getContext('2d'),

            // Use the Canvas Image Data API, in order to get all the
            // underlying pixels data of that canvas. This will basically
            // return an array (Uint8ClampedArray) containing the data in the
            // RGBA order. Every 4 items represent one pixel.
            pixels = ctx.getImageData(0, 0, c.width, c.height),

            // total pixels
            l = pixels.data.length,

            // main loop counter and pixels coordinates
            i, x, y,

            // an object that will store the area that isn't transparent
            bound = { top: null, left: null, right: null, bottom: null };

        // for every pixel in there
        for (i = 0; i < l; i += 4) {

            // if the alpha value isn't ZERO (transparent pixel)
            if (pixels.data[i+3] !== 0) {

                // find it's coordinates
                x = (i / 4) % c.width;
                y = ~~((i / 4) / c.width);

                // store/update those coordinates
                // inside our bounding box Object

                if (bound.top === null) {
                    bound.top = y;
                }

                if (bound.left === null) {
                    bound.left = x;
                } else if (x < bound.left) {
                    bound.left = x;
                }

                if (bound.right === null) {
                    bound.right = x;
                } else if (bound.right < x) {
                    bound.right = x;
                }

                if (bound.bottom === null) {
                    bound.bottom = y;
                } else if (bound.bottom < y) {
                    bound.bottom = y;
                }
            }
        }

        // actual height and width of the text
        // (the zone that is actually filled with pixels)
        let trimHeight = bound.bottom - bound.top,
            trimWidth = bound.right - bound.left,

            // get the zone (trimWidth x trimHeight) as an ImageData
            // (Uint8ClampedArray of pixels) from our canvas
            trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

        // Draw back the ImageData into the canvas
        copy.canvas.width = trimWidth;
        copy.canvas.height = trimHeight;
        copy.putImageData(trimmed, 0, 0);

        // return the canvas element
        return copy.canvas;
    }

    //remove from dom
    canvas.parentNode.removeChild(canvas);

    return {
        width: result.width,
        height: result.height
    }
}

function sizeLines(els, lineHeightAdjustment) {
    //find width of line el with shortest width
    let shortest_text = null;

    for(let i = 0; i < els.length; i++) {
        let line_el = els[i];

        // let box = line_el.getBoundingClientRect();
        let dims = getTextDims(line_el);

        if(!shortest_text || dims.width < shortest_text.width) {
            shortest_text = {
                el: line_el,
                width: dims.width
            };
        }
    }

    function setFontSize(el) {
        let inc = .1;
        let smallest = 10;
        let largest = 100;

        let closest_size = null;

        //loop through possible font sizes to find closest in width to line el found in shortest_text

        for(let i = smallest; i < largest; i += inc) {
            let fontSize = parseFloat(i.toFixed(1)) + 'px';
            let new_el = el.cloneNode(true);

            makeElHidden(new_el);

            new_el.style.fontSize = fontSize;

            //add to same parent as original el to inherit styles for consistency
            el.parentNode.appendChild(new_el);

            let new_box = new_el.getBoundingClientRect();

            //calculate width diff between comparison el
            let width_diff = Math.abs(new_box.width - shortest_text.width);

            //set closest size if width diff is smallest based on font size
            if(!closest_size || width_diff < closest_size.width_diff) {
                closest_size = {
                    width_diff: width_diff,
                    font_size: fontSize
                };
            }

            //remove test node from dom
            new_el.parentNode.removeChild(new_el);
        }

        if(closest_size) {
            //sets calculated font size to match width on line el
            el.style.fontSize = closest_size.font_size;
        }
    }

    //update font size
    for(let i = 0; i < els.length; i++) {
        let line_el = els[i];

        if(line_el !== shortest_text.el) {
            setFontSize(line_el);
        }
    }

    //set line height based on actual height of text
    let set_line_height = 0;

    for(let i = 0; i < els.length; i++) {
        let el = els[i];

        let lineHeight = getTextDims(el);

        if(lineHeight) {
            el.style.lineHeight = `${lineHeight.height}px`;
        }
    }
}