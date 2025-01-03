let dbService = require('../services/db');
let ejs = require('ejs');


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
                title: `Befriend: Arriving 2025.`,
                description: `Real friends. Real-time`,
                count: count
            });

            resolve();
        });
    },
    postWaitlist: function (req, res) {
        return new Promise(async (resolve, reject) => {
            let email = req.body.email;

            if(isValidEmail(email)) {
                let conn = await dbService.conn();

                let email_check = await conn('waitlist')
                    .where('email', email)
                    .first();

                if(email_check) {
                    res.json({
                        result: 'error',
                        msg: 'Email already exists'
                    }, 400);
                } else {
                    let user_code = generateToken(20);

                    let user_name = email.split('@')[0];

                    let check = await conn('waitlist')
                        .where('user_name', user_name)
                        .first();

                    if(check) {
                        for(let i = 0; i < 100; i++) {
                            let new_username = user_name + (i + 2);

                            let new_check = await conn('waitlist')
                                .where('user_name', new_username)
                                .first();

                            if (new_check) {
                                //do nothing
                            } else {
                                user_name = new_username;
                                break;
                            }
                        }
                    }

                    let new_user_id = await conn('waitlist')
                        .insert({
                            email: email,
                            user_name: user_name,
                            user_code: user_code,
                            ip_address: getIPAddr(req),
                            created_at: getDateTimeStr(),
                            updated_at: getDateTimeStr()
                        });

                    //send confirm email
                    let view_path = joinPaths(getRepoRoot(), 'views/emails/waitlist-confirm.ejs');

                    let html = await ejs.renderFile(view_path, {
                        user_code: user_code,
                        user_name: user_name
                    });

                    let inlineCss = require('inline-css');

                    html = await inlineCss(html, {
                        url: 'filePath'
                    });

                    if(email) {
                        await sendEmail(`Befriend: please confirm your email`, html, email, 'Befriend <welcome@befriend.app>');
                    }

                    //thank-you email
                    let view_path_coming_soon = joinPaths(getRepoRoot(), 'views/emails/waitlist.ejs');

                    html = await ejs.renderFile(view_path_coming_soon, {
                        user_code: user_code,
                    });

                    html = await inlineCss(html, {
                        url: 'filePath'
                    });

                    if(email) {
                        setTimeout(async function () {
                            try {
                                // sendEmail(`Coming in 2025`, html, email, 'Eugene at Befriend <eugene@befriend.app>');
                            } catch(e) {
                                console.error(e);
                            }
                        }, 3 * 10000);
                    }

                    res.json({
                        result: 'success',
                        msg: 'Signup successful'
                    });
                }
            } else {
                res.json({
                    result: 'error',
                    msg: `Email not valid`
                }, 400);
            }

            resolve();
        });
    },
}
