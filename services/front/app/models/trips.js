const req = require("request-promise");
const refresh = require("app/helpers/authorizer");
const helpers = require("app/helpers");
const conf = require("config/index");


exports.getRecents = async function (limit , page) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/trips/getRecent",
        method: "POST",
        form : {
            limit,
            page
        }
    });
};

exports.getOne = async function (id) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/trips/getOne",
        method: "POST",
        form : {
            id
        }
    });
};

exports.getOneBySlug = async function (slug) {
    return new Promise((res, rej) => {
        req({
            uri: conf.service.apiAdd.web_add + "/trips/getOneBySlug",
            method: "POST",
            form : {
                slug
            }
        }).then((trips) => {
            res(trips);
        }).catch(async (e) => {
            if (e.status === 401) {
                // await refreshToken accesstoken set
                res(await getOneBySlug(slug))
            }
            rej(e);
        });
    })
};
exports.getPopular = async function (limit , page) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/trips/getPopular",
        method: "POST",
        form : {
            limit,
            page
        }
    });
};
exports.getSuggested = async function (limit , page) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/trips/getSuggested",
        method: "POST",
        form : {
            limit,
            page
        }
    });
};
exports.request = async function (id , registers, requ, resp) {
    cookies = new helpers(requ, resp).parseCookies();
    return new Promise(async (res, rej) => {
        req({
            uri: conf.service.apiAdd.web_add + "/payment/request",
            method: "POST",
            headers: {
                Authorization: "Bearer " + cookies.authToken
            },
            form : {
                tripId: id,
                registers: JSON.stringify(registers),
                platform: "web"
            }
        }).then((response) => {
            res(response);
        }).catch( async (e) => {
            console.log({e});
            if(e.status == 401) {
                console.log(e);
                // requ.cookie('authToken', await refresh.refreshToken(cookies.authRefresh));
                // resp.redirect(requ.path);
            }
            rej(e);
        });
    })
};

exports.unAuthRequest = async function (id , registers) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/payment/unAuthRequest",
        method: "POST",
        form : {
            tripId: id,
            registers: JSON.stringify(registers),
            platform: "web"
        }
    });
};

exports.search = async function (phrase , limit , page) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/trips/search",
        method: "POST",
        form : {
            phrase,
            limit,
            page
        }
    });
};

exports.contactUs = async function (fullName , text, subject, contactInfo) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/user/contactUs",
        method: "POST",
        form : {
            fullName,
            text,
            subject,
            contactInfo
        }
    });
};